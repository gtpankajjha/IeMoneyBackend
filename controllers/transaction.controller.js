// import collection model
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
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
exports.createTransaction = async function (req, res) {
  try {
    console.log("createTransaction", req.body);
    const { senderId, receiverMobileNumber, amount, note } = req.body;

    // const name = "mohan"
    // user_controller.getUserByValue(name)

    const receiver = await User.findOne({
      mobileNumber: receiverMobileNumber,
    }).exec();

    const sender = await User.findOne({
      _id: senderId,
    }).exec();

    console.log("sender IE_Points", sender.IE_Points);
    console.log("receiver IE_Points", receiver.IE_Points);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (sender.IE_Points < amount) {
      return res.status(400).json({ error: 'Insufficient IE points' });
    }

    let newTransaction = new Transaction({
      senderId,
      receiverId: receiver._id,
      receiverMobileNumber,
      amount,
      note,
    });

     // Update sender and receiver gift points
     sender.IE_Points -= amount;
     receiver.IE_Points += amount;

     await sender.save();
     await receiver.save();
    //  await transaction.save();

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

exports.getTransactionByTransactId = function (req, res) {
  let transactID = req.body.transactID;
  Transaction.findById(transactID)
    .then((transaction) => {
      res.status(200).json({ data: transaction });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};

exports.getTransactionsByUserId = function (req, res) {
  let userId = req.body.userId;
  console.log("userId", userId);
  Transaction.find({ senderId: userId })
    .then((transaction) => {
      res.status(200).json({ data: transaction });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};
