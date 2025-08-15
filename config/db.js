const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("Error connecting to MongoDB ❌", error);
    process.exit(1);
  }
};

module.exports = ConnectDB;
