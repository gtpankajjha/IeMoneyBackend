// import collection model
const Transaction = require("../models/transaction.model");
const user_controller = require("../controllers/user.controller");


//get all
exports.getAllTransaction = function (req, res) {
    
  Transaction.find()
    .then((transaction) => {
      res.status(200).json({ data: transaction });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

// create transaction
exports.createTransaction = function (req, res) {
  try {
    console.log("createTransaction", req.body);
    const { senderId, receiverMobileNumber, amount, note } = req.body;

    // const name = "mohan"
    // user_controller.getUserByValue(name)

    let newTransaction = new Transaction({
        senderId,
        receiverMobileNumber,
        amount,
        note
    });
  
    Transaction.create(newTransaction)
      .then(() => {
        res.status(200).json({
          success: "true",
          data: "created",
        });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
    
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Server error" });
  }
};
