const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { validatePassword } = require("../utils/validatePassword");
const bcrypt = require("bcrypt");
const Setting = require("../models/Setting");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

//generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const { isValid, message } = validatePassword(password);
    if (!isValid) {
      return res.status(400).json({ success: false, message });
    }

    const emailLower = email.toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email: emailLower,
      password,
      role: "user",
      profileImageUrl: profileImage,
    });

    // Create default settings
    const settings = await Setting.create({
      userId: user._id,
      theme: "light",
      language: "en",
      notification: true,
      currency: "USD",
    });

    // Send response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
      },
      settings,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

//Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};

// user info
exports.getUserInfo = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id).select("-password -otp -otpExpires");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User info get successfully", user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error to get user info",
      error: error.message,
    });
  }
};

//update user info
exports.updateUserInfo = async (req, res) => {
  const id = req.user.id;
  const { fullName } = req.body;
  const imageUrl = req.file ? req.file.filename : null;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.fullName = fullName || user.fullName;
    user.profileImageUrl = imageUrl || user.profileImageUrl;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User info updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user info",
      error: error.message,
    });
  }
};

//user dashboard
exports.getUserDashboard = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  try {
    // Total income
    const totalIncome = await Transaction.aggregate([
      { $match: { userId, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Total expense
    const totalExpense = await Transaction.aggregate([
      { $match: { userId, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get recent 5 incomes
    const recentIncomes = await Transaction.find({ userId, type: "income" })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent 5 expenses
    const recentExpenses = await Transaction.find({ userId, type: "expense" })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: "User dashboard fetched successfully",
      dashboard: {
        totalIncomeAmount: totalIncome[0]?.total || 0,
        totalExpenseAmount: totalExpense[0]?.total || 0,
        recentIncomes,
        recentExpenses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting user dashboard",
      error: error.message,
    });
  }
};

//get settings
exports.getSettings = async (req, res) => {
  const userId = req.user.id;
  try {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.status(200).json({
      success: true,
      message: "Settings get successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting settings",
      error: error.message,
    });
  }
};

//update settings
exports.updateSettings = async (req, res) => {
  const userId = req.user.id;
  const { theme, language, timezone, notification, currency } = req.body;
  try {
    const settings = await Setting.findOneAndUpdate(
      { userId },
      { theme, language, timezone, notification, currency },
      { upsert: true, new: true }
    );
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating settings",
      error: error.message,
    });
  }
};

//Admin get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
};
