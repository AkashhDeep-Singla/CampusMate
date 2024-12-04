require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const checkSecurity = require("./middlewares/checkSecurity").checkSecurity;

const gateSecurity = require("./routes/gateSecurity");

const admin = require("./models/adminModel");
const reservation = require("./models/gatepassModel");
const Complaints = require("./models/complaintModel");

const complaint = require("./Controllers/complaintController");
const reserve = require("./Controllers/reservationController");
const gate = require("./Controllers/gatepassController");
const gatepass = require("./models/gatepassModel");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messRoutes = require("./routes/messSecurity");

const getQRcode = require("./helpers/qrCodeGetter");

const student = require("./models/studentModel");

const qrScan = require("./routes/qr");

const messScheduler = require("./helpers/messScheduler");
// const session = require('express-session');

app.use(express.json());

const Dbconnect = require("./middlewares/Db");
Dbconnect();

app.use("/student", userRoutes);
app.use("/admin", adminRoutes);
app.use("/mess", messRoutes);
app.use("/gateSecurity", gateSecurity);
app.post("/qrscanner", qrScan.processQR);

messScheduler();

app.post("/getTokenForSecurity", (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log("Received Token:",token);
  if (token) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
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
  res.clearCookie("token");
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
                body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
                h1 { color: #27ae60; }
                p { color: #555; font-size: 1.2em; }
                img { margin-top: 20px; width: 150px; height: 150px; border-radius: 50%; object-fit: cover; }
              </style>
            </head>
            <body>
              <h1>Mess Entry Status Updated</h1>
              <p>Enrollment ID: <strong>${enrollmentID}</strong></p>
              <p><strong>${user.name}</strong></p>
              <img src="${user.img}" alt="Student Image" />
              <p>New Mess Entry Status: <strong>${user.messEntry}</strong></p>
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
                  body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
                  h1 { color: #e67e22; }
                  p { color: #555; font-size: 1.2em; }
                </style>
              </head>
              <body>
                <h1>Cannot Update Entry</h1>
                <p>Gate pass is not approved for the student with Enrollment ID: <strong>${enrollmentID}</strong></p>
                <p>Gate Pass Status: <strong>${latestGatePass.status}</strong></p>
              </body>
            </html>
          `);
      }
      if (user.gateEntry == "IN-OUT") {
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

      return res.send(`
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
                h1 { color: #2980b9; }
                img { margin-top: 20px; width: 150px; height: 150px; border-radius: 50%; object-fit: cover; }
                p { color: #555; font-size: 1.2em; }
              </style>
            </head>
            <body>
              <h1>Gate Entry Status Updated</h1>
              <p>Enrollment ID: <strong>${enrollmentID}</strong></p>
              <img src=${user.img} />
              <p>New Gate Entry Status: <strong>${user.gateEntry}</strong></p>
              <h2>Gate Pass Details</h2>
              <p>Status: <strong>${latestGatePass.status}</strong></p>
              <p>Created At: <strong>${new Date(
                latestGatePass.createdAt
              ).toLocaleString()}</strong></p>
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
app.post("/usercomplaints", complaint.createComplaint);
app.get("/complaintList", complaint.complaintList);

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

app.listen(3005, () => {
  console.log("Server started on 3005");
});
