const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  language: { type: String, default: "en" },
  timezone: { type: String },
  notification: { type: Boolean, default: true },
  currency: { type: String, default: "USD" },
});

module.exports = mongoose.model("Setting", SettingSchema);
