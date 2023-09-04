const express = require("express");
const router = express.Router();

const transaction_controller = require("../controllers/transaction.controller");

router.get("/", transaction_controller.getAllTransaction);
router.post("/create", transaction_controller.createTransaction);
router.get("/getByTransactId", transaction_controller.getTransactionByTransactId);
router.get("/getByTransactUserId", transaction_controller.getTransactionsByUserId);

module.exports = router;
