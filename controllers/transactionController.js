const Transaction = require("../models/Transaction");

//add transaction
exports.addTransaction = async (req, res) => {
  const userId = req.user.id;
  try {
    const {
      title,
      amount,
      category,
      type,
      tags,
      note,
      currency,
      wallet,
      date,
    } = req.body;
    const receiptUrl = req.file ? req.file.filename : null;

    if (
      !title ||
      !amount ||
      !category ||
      !type ||
      !tags ||
      !note ||
      !currency ||
      !wallet ||
      !date
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const transaction = await Transaction.create({
      userId,
      title,
      amount,
      category,
      type,
      tags,
      note,
      currency,
      wallet,
      date,
      receiptUrl,
    });
    res
      .status(201)
      .json({ success: true, message: "Transaction added", transaction });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Add transaction failed server",
      error: error.message,
    });
  }
};

//get with filter transaction
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, keyword } = req.query;

    const filter = { userId: req.user.id };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { note: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ];
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json({
      success: true,
      message: "Get transaction successfully",
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get transactions failed",
      error: error.message,
    });
  }
};

// update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.user.id;

    const updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      updateData.receiptUrl = req.file.filename;
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      updateData,
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
        debug: {
          transactionId,
          userId,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

//delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Delete failed", error: error.message });
  }
};
