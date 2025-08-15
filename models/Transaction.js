const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["income", "expense"], required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String },
    tags: String,
    receiptUrl: { type: String },
    currency: { type: String, default: "USD" },
    wallet: { type: String, default: "Cash" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
