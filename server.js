require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ConnectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

ConnectDB();

//middleware to handle cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Api added successfully");
});

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
