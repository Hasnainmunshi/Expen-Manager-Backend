const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/add-transaction",
  upload.single("receipt"),
  protect,
  addTransaction
);
router.get("/get-transaction", protect, getTransactions);
router.put(
  "/update-transaction/:id",
  upload.single("receipt"),
  protect,
  updateTransaction
);
router.delete("/delete-transaction/:id", protect, deleteTransaction);

module.exports = router;
