require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SendMail = require("./helpers/mailService");


const app = express();
app.use(cookieParser());
app.use(
  cors({
    // origin: "https://stackmasters-campusmate.vercel.app",
    origin:"https://stackmasters-campusmate.vercel.app",
    credentials: true,
  })
);

const jwt = require("jsonwebtoken");

const checkSecurity = require("./middlewares/checkSecurity").checkSecurity;

const JWT_SECRET = "123";

const admin = require("./models/adminModel");
const reservation = require("./models/gatepassModel");
const student = require("./models/studentModel");
const Complaints = require("./models/complaintModel");
const gatepass = require("./models/gatepassModel");
const Guard = require("./models/gateSecurityModel");

const complaint = require("./Controllers/complaintController");
const reserve = require("./Controllers/reservationController");
const gate = require("./Controllers/gatepassController");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const superRoutes = require("./routes/superRoutes");
const gateSecurity = require("./routes/gateSecurity");
const messRoutes = require("./routes/messSecurity");
const qrScan = require("./routes/qr");

const getQRcode = require("./helpers/qrCodeGetter");
const messScheduler = require("./helpers/messScheduler");
const paymentRoutes = require("./routes/paymentRoute");

// const session = require('express-session');

app.use(express.json());

const Dbconnect = require("./middlewares/Db");
Dbconnect();

app.use("/student", userRoutes);
app.use("/admin", adminRoutes);
app.use("/super-admin", superRoutes);
app.use("/mess", messRoutes);
app.use("/gateSecurity", gateSecurity);
app.post("/qrscanner", qrScan.processQR);
// Payment Routes
app.use("/api/payment", paymentRoutes);

messScheduler();

app.post("/getTokenForSecurity", (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log("Received Token:",token);
  if (token) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Send cookie over HTTPS only
      sameSite: "none",
      maxAge: 3600000
    });
    console.log(token);

    return res.status(200).json({ msg: "Token stored in cookie" });
  } else {
    return res
      .status(400)
      .json({ msg: "No token provided in Authorization header" });
  }
});

// app.use(session({
//     secret: '1234',
//     resave: false,
//     saveUninitialized: true,
//   }));

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/", // Same as the one used when setting the cookie
  });

  res.status(200).send({ message: "Logged out successfully" });
});

app.get("/get-qrcode/:enrollmentID", getQRcode);
app.get("/qr-scan/:enrollmentID", checkSecurity, async (req, res) => {
  try {
    const { enrollmentID } = req.params;
    const role = req.securityRole;
    const user = await student.findOne({ enrollmentID });

    if (!user) {
      return res.status(404).send(`
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
                h1 { color: #e74c3c; }
                p { color: #555; font-size: 1.2em; }
              </style>
            </head>
            <body>
              <h1>Student Not Found</h1>
              <p>No student found with Enrollment ID: <strong>${enrollmentID}</strong></p>
            </body>
          </html>
        `);
    }

    if (role == "MessSecurity") {
      user.messEntry = user.messEntry === "OUT" ? "IN" : "OUT";
      await user.save();

      return res.send(`
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: gray;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 300px;
        padding: 20px;
        text-align: center;
        transition: transform 0.3s ease;
      }

      h1 {
        color: #27ae60;
        font-size: 24px;
        margin-bottom: 20px;
      }

      p {
        color: #555;
        font-size: 1.2em;
      }

      img {
        margin-top: 20px;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 20px;
      }

      strong {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Mess Entry Status Updated</h1>
      <p>Enrollment ID: <strong>${enrollmentID}</strong></p>
      <p><strong>${user.name}</strong></p>
      <img src="${user.img}" alt="Student Image" />
      <p>New Mess Entry Status: <strong>${user.messEntry}</strong></p>
    </div>
  </body>
</html>
        `);
    } else if (role == "GateSecurity") {
      const gatePasses = await reservation
        .find({ enrollmentId: enrollmentID })
        .sort({ createdAt: -1 });

      if (!gatePasses || gatePasses.length === 0) {
        return res.status(404).send(`
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
                  h1 { color: #e74c3c; }
                  p { color: #555; font-size: 1.2em; }
                </style>
              </head>
              <body>
                <h1>No Gate Pass Found</h1>
                <p>No gate pass found for the student with Enrollment ID: <strong>${enrollmentID}</strong></p>
              </body>
            </html>
          `);
      }

      const latestGatePass = gatePasses[0];

      if (latestGatePass.status != "Approved") {
        return res.status(403).send(`
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color:gray;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 300px;
        padding: 20px;
        text-align: center;
      }

      h1 {
        color: #e67e22;
        font-size: 24px;
        margin-bottom: 20px;
      }

      p {
        color: #555;
        font-size: 1.2em;
      }

      strong {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Cannot Update Entry</h1>
      <p>Gate pass is not approved for the student with Enrollment ID: <strong>${enrollmentID}</strong></p>
      <p>Gate Pass Status: <strong>${latestGatePass.status}</strong></p>
    </div>
  </body>
</html>

          `);
      }
      if (user.gateEntry == "IN-OUT") {
        return res.status(404).send(`
                <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: gray;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 300px;
        padding: 20px;
        text-align: center;
        transition: transform 0.3s ease;
      }


      h1 {
        color: #e74c3c;
        font-size: 24px;
        margin-bottom: 20px;
      }

      p {
        color: #555;
        font-size: 1.2em;
      }

      strong {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>No Gate Pass Found</h1>
      <p>No gate pass found for the student with Enrollment ID: <strong>${enrollmentID}</strong></p>
    </div>
  </body>
</html>

              `);
      }
      const currentTime = new Date();
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      //   console.log(latestGatePass.intime< currentTime);

      if (
        new Date(latestGatePass.intime) < currentTime ||
        new Date(latestGatePass.outdate) < currentDate
      ) {
        return res.status(404).send(`
        <html>
            <head>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        margin: 20px; 
                        background-color: #f9f9f9; 
                        color: #333; 
                    }
                    h1 { 
                        color: #e74c3c; 
                        font-size: 2.5em; 
                        margin-bottom: 10px; 
                    }
                    p { 
                        font-size: 1.2em; 
                        line-height: 1.6; 
                    }
                    strong { 
                        color: #e74c3c; 
                    }
                </style>
            </head>
            <body>
                <h1>No Valid Gate Pass Found</h1>
                <p>
                    The gate pass for the student with Enrollment ID: <strong>${enrollmentID}</strong> 
                    is either expired or not yet active.
                </p>
                <p>
                    Please ensure that the gate pass is valid for the current date and time.
                </p>
            </body>
        </html>
    `);
      }

      user.gateEntry = user.gateEntry === "IN" ? "OUT" : "IN-OUT";
      await user.save();

      const emailSubject = `${user.gateEntry == "OUT" ? `- Left the Campus` : `- Returned to Campus`}`;
      const emailBody = `
              Welcome ${user.name}, 
  
              Your account has been successfully created with the following details:
              - Email: ${user.email}
              - Enrollment ID: ${enrollmentID}
              - GatePass : ${latestGatePass}
              ${user.gateEntry == "OUT" ? `- Left the Campus at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}` : `- Returned to Campus at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`}
  
              Thank you for joining CampusMate!
          `;

      const mail = await SendMail(user.email, emailSubject, emailBody);

      return res.send(`
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color:gray;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 300px;
        padding: 20px;
        text-align: center;
      }

      h1 {
        color: #2980b9;
        font-size: 24px;
        margin-bottom: 20px;
      }

      h2 {
        color: #555;
        font-size: 20px;
        margin-top: 20px;
      }

      p {
        color: #555;
        font-size: 1.2em;
        margin: 10px 0;
      }

      strong {
        color: #333;
      }

      img {
        margin-top: 20px;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Gate Entry Status Updated</h1>
      <p>Enrollment ID: <strong>${enrollmentID}</strong></p>
      <img src="${user.img}" alt="Student Image" />
      <p>New Gate Entry Status: <strong>${user.gateEntry}</strong></p>
      <h2>Gate Pass Details</h2>
      <p>Status: <strong>${latestGatePass.status}</strong></p>
      <p>Created At: <strong>${new Date(
        latestGatePass.createdAt
      ).toLocaleString()}</strong></p>
    </div>
  </body>
</html>

        `);


    } else {
      return res.status(403).send(`
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
                h1 { color: #c0392b; }
                p { color: #555; font-size: 1.2em; }
              </style>
            </head>
            <body>
              <h1>Unauthorized Access</h1>
              <p>Invalid role detected for user: <strong>${role}</strong></p>
            </body>
          </html>
        `);
    }
  } catch (error) {
    console.error("Error updating entry status:", error);
    res.status(500).send(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
              h1 { color: #e74c3c; }
              p { color: #555; font-size: 1.2em; }
            </style>
          </head>
          <body>
            <h1>Internal Server Error</h1>
            <p>Something went wrong. Please try again later.</p>
          </body>
        </html>
      `);
  }
});

app.get("/no-reload", (req, res) => {
  res.render("No Reload ALlowed");
});

app.get("/getUserRole", async (req, res) => {
  try {
    console.log("hello");
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const role = decoded.role;

    console.log(role);

    res.json({ role });
  } catch (err) {
    console.error(err);

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

app.get("/clearcookie", async (req, res) => {
  try {
    console.log("Cookies before clearing:", req.cookies);

    // Clear the 'token' cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/", // Same as the one used when setting the cookie
    });

    console.log("Cookie cleared successfully.");
    res.status(200).json({ message: "Cookie cleared successfully." }); // Send JSON response
  } catch (error) {
    console.error("Error clearing cookie:", error);
    res.status(500).json({ message: "Failed to clear cookie." }); // Send error response as JSON
  }
});


//Booking Routes
app.post("/reservation", reserve.reservation);
app.get("/reservationlist", reserve.getreservation);

//GatePass Routes
app.post("/gatepass", gate.createGatepass);
app.get("/gatepasseslist", async (req, res) => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    const Admin = await admin.findOne({ token });
    // console.log(Admin.hostel);
    const hostelName = Admin.hostel;
    console.log(hostelName);
    const gatepasses = await gatepass
      .find({ hostel: hostelName })
      .populate("studentId");
    res.json(gatepasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/gatepass/status", gate.updateGatepassStatus);

//Complaints Routes
app.post("/studentcomplaints", complaint.createComplaint);
app.get("/complaintList", complaint.complaintList);
app.patch("/complaint/status", complaint.updateComplaintStatus);

app.post("/gatePass/checkGatePass", gate.checkGatePass);

app.get("/warden-dashboard", async (req, res) => {
  try {
    const studentsCount = await student.countDocuments();
    const complaints = await Complaints.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const totalGatePasses = await gatepass.countDocuments();
    const approvedGatePasses = await gatepass.countDocuments({
      status: "Approved",
    });

    const messSecurity = Math.floor(Math.random() * 100); // Example percentage

    // Prepare data for the dashboard
    const dashboardData = {
      gatePass: { used: approvedGatePasses, total: totalGatePasses },
      students: studentsCount,
      complaints: complaints.map((c) => ({ label: c._id, count: c.count })),
      messSecurity,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/super-admin/wardens", async (req, res) => {
  try {
    const wardens = await admin.find({});
    res.json(wardens);
  } catch (error) {
    console.error(error);
    res.send("Internal Server Error");
  }
});

app.get("/super-admin/guards", async (req, res) => {
  try {
    const guards = await Guard.find({});
    res.json(guards);
  } catch (error) {
    console.error(error);
    res.send("Internal Server Error");
  }
});

app.get("/super-admin/wardens", async (req, res) => {
  try {
    const wardens = await admin.find({});
    res.json(wardens);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/super-admin/guards", async (req, res) => {
  try {
    const guards = await Guard.find({});
    res.json(guards);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/isSubscribed", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.send("NO")
    }
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const subscription = user.newsletter
    res.send(subscription)
  } catch (err) {
    console.error("Error in isBooked:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})
app.get("/newsletter", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ msg: "No token found" })
  }
  const user = await student.findOne({ token })
  if (!user) {
    return res.status(400).json({ msg: "No User found" })
  }
  const emailBody = `
            Welcome ${user.name}, 
            Thank you for subscribing to our newsletter

            Regards,
            CampusMate by StackMasters
        `;
  user.newsletter = "YES";
  await user.save();
  await SendMail(user.email, "Subscribed to CampusMate newsletter", emailBody)
})
app.listen(3005, () => {
  console.log("Server started on 3005");
});
