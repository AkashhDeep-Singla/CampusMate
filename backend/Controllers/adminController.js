const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "123";
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, gender, hostel, role, password } = req.body;
    console.log(req.body);


    if (!name || !email || !gender || !hostel || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (/\d/.test(name)) {
      return res.status(400).json({ msg: "Name should not contain numbers" });
    }

    if (/\d/.test(role)) {
      return res.status(400).json({ msg: "Role should not contain numbers" });
    }

    if (/\s/.test(password)) {
      return res.status(400).json({ msg: "Password should not contain spaces" });
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Check if password meets minimum length (example: 6 characters)
    if (password.length < 8) {
      return res.status(400).json({ msg: "Password should be at least 8 characters long" });
    }

    const existingMail = await Admin.findOne({ $or: [{ email: email }] });
    if (existingMail) {
      console.log("User already exists");
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });
    }
    const existingWarden = await Admin.findOne({ $and: [{ hostel: hostel }, { role: role }] });
    if (existingWarden) {
      console.log("User already exists");
      return res
        .status(400)
        .json({ msg: `${role} already exists for ${hostel}` });
    }

    const imageUrl = req.file?.path;
    console.log(imageUrl);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = await Admin.create({
      name,
      hostel,
      role,
      gender,
      email,
      password: hashedPassword,
      profilePic: imageUrl
    });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'warden' },
      JWT_SECRET
    );

    // await res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: true, // Send cookie over HTTPS only
    //   sameSite: "none",
    // });
    admin.token = token;
    admin.save();

    console.log(admin);
    return res.status(201).json({ success: true, msg: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Please check the details you have entered or try again later",
    });
  }
};

const login = async (req, res) => {
  try {
    console.log("Received login request:", req.body);

    const { email, password } = req.body;
    console.log(email, password);

    for (const key in req.body) {
      if (!req.body[key] || req.body[key].trim() === "") {
        console.log(`Field ${key} is missing or empty`);
        return res.status(400).json({
          status: 400,
          msg: `Field ${key} is missing or empty`,
        });
      }
    }
    const admin = await Admin.findOne({ email });
    console.log(admin);

    if (!admin) {
      console.log("User not found with the provided email");
      return res.status(401).json({ msg: "Incorrect credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ msg: "Incorrect credentials" });
    }
    const token = admin.token;

    console.log("The token of the user is ", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Send cookie over HTTPS only
      sameSite: "none",
      maxAge: 3600000
    });

    console.log("Login successful, returning token ", req.cookies.token);
    return res.status(200).json({ msg: "done" });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ msg: "An error occurred during login" });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params._id;
    const update = req.body;

    const schemaFields = Object.keys(User.schema.paths);

    for (const key in update) {
      if (!schemaFields.includes(key)) {
        return res.status(400).json({
          status: 400,
          msg: `Unknown field: ${key}`,
        });
      }
      if (!update[key] || update[key].trim() === "") {
        return res.status(400).json({
          status: 400,
          msg: `Field ${key} is missing or empty`,
        });
      }
    }

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const updateData = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updateData) {
      return res.status(404).json({
        status: 404,
        msg: "User not found",
      });
    }

    res.json({
      status: 200,
      msg: "User updated successfully",
      updateData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: 500,
      msg: "An error occurred while updating the user",
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ success: false, msg: "Admin not found." });
    }

    res.json({ success: true, msg: "Admin deleted successfully." });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res
      .status(500)
      .json({
        success: false,
        msg: "An error occurred while deleting the admin.",
      });
  }
};

const showData = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ msg: "No token provided, unauthorized" });
    }

    const admin = await Admin.findOne({ token });

    if (!admin) {
      return res
        .status(404)
        .json({ msg: "Admin not found with the provided token" });
    }

    return res.status(200).json({ admin });
  } catch (err) {
    console.error("Error happened:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const updateMenu = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ msg: "Authorization token is missing" });
    }

    const admin = await Admin.findOne({ token });

    if (!admin) {
      return res.status(401).json({ msg: "Admin not found, authorization failed" });
    }

    const { description } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ msg: "Description is required" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Image is required to be uploaded" });
    }
    console.log(description);

    const imageUrl = req.file?.path;

    admin.messDesc = description;
    admin.messMenu = imageUrl;

    await admin.save();

    return res.status(200).json({
      success: true,
      msg: "Mess menu updated successfully",
      imageUrl: imageUrl,
      description: description
    });

  } catch (error) {
    console.error("Error updating mess menu:", error);
    return res.status(500).json({ msg: "Server error while updating mess menu", error: error.message });
  }
};


const showMenu = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: "Authorization token is missing" });
  }

  const admin = await Admin.findOne({ token });

  if (!admin) {
    return res.status(401).json({ msg: "Admin not found, authorization failed" });
  }

  return res.status(200).json({
    success: true,
    msg: "Mess menu updated successfully",
    imageUrl: admin.messMenu,
    description: admin.messDesc
  });

}


module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  showData,
  updateMenu,
  showMenu
};
