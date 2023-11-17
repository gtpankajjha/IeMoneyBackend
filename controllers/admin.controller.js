// import collection model
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

//Get All Users
exports.getAllUsers = async function (req, res) {
  const data = await User.find();
  res.status(200).json(data);
};

// get data by ID
exports.getUserById = function (req, res) {
  let userID = req.body.userID;
  User.findById(userID)
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};

// get user by mobile number
exports.getUserByMobileNumber = function (req, res) {
  let mobileNumber = req.body.mobileNumber;
  User.findOne({ mobileNumber })
    .then((user) => {
      if (user) {
        res.status(200).json({ data: user });
      } else {
        res.status(400).json({
          error: "User Not Found",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// function to get user by particular user value
exports.getUserByValue = function (value) {
  User.findOne({ value })
    .then((user) => {
      if (user) {
        console.log("User found:", user);
      } else {
        console.log("User not found");
      }
    })
    .catch((error) => {
      console.error("Error finding user:", error);
    });
};

// Register User
exports.registerNewUser = async function (req, res) {
  const data = req.body;
  console.log("user req body:", data);

  const {
    name,
    mobileNumber,
    email,
    password,
    setPassword,
    userType,
    pin,
    setPin,
    age,
    gender,
    kyc,
    address,
    acceptTerms,
    IE_Points,
    IE_Vouchers,
  } = data;

  await bcrypt
    .genSalt(10)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      const hashedPassword = hash;

      if (!name || !email || !password || !mobileNumber || !userType) {
        res.status(400).send({ error: "All fields are required", data });
      } else {
        //   find if user exists
        User.findOne({ mobileNumber }).then((user) => {
          if (user) {
            error = "User Already Exists";
            return res.status(400).json({ error });
          } else {
            const newUser = new User({
              name,
              mobileNumber,
              email,
              password: hashedPassword,
              setPassword,
              userType,
              pin,
              setPin,
              age,
              gender,
              kyc,
              address,
              acceptTerms,
              IE_Points,
              IE_Vouchers,
            });

            const response = User.create(newUser);
            res
              .status(200)
              .json({ success: true, status: "200", data: newUser });
          }
        });
      }
    })
    .catch((err) => console.error(err.message));
};

// Update user details
exports.updateUser = function (req, res) {
  // let data = req.body;
  let updatedUserData = req.body;

  User.findByIdAndUpdate(updatedUserData.userId, { $set: updatedUserData })
    .then((user) => {
      res.status(200).json({
        message: "Updated Successfully!",
        data: updatedUserData,
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
};

// delete user
exports.deleteUser = function (req, res) {
  let userId = req.body.userId;

  User.findByIdAndRemove(userId)
    .then(() => {
      res.status(200).json({
        message: "Deleted Successfully!",
      });
    })
    .catch((err) => {
      req.json({
        error: err,
      });
    });
};

// Login User admin
exports.loginAdmin = async function (req, res) {
  const { mobileNumber, password } = req.body;
  console.log("login data: ", req.body);

  User.findOne({ mobileNumber })
    .then((user) => {
      if (!user) {
        // return res.status(404).json({ error: "User Not Found" });
        return res
          .status(404)
          .send(JSON.stringify({ error: "User Not Found" }));
      } else {
        //Check password
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            //User matched
            res.status(200).json({ success: "true", data: user });

            //Create JWT Payload
            // const payload = {
            //   id: user.id,
            //   name: user.name,
            //   email: user.email,
            //   userType: user.userType,
            //   mobile: user.mobile,
            // };
            // //Sign Token
            // jwt.sign(payload, keys.secretOrKey, (err, token) => {
            //   res.json({
            //     success: true,
            //     token: "Bearer " + token,
            //     payload: payload,
            //   });
            // });
          } else {
            error = "Password Incorrect";
            return res.status(400).json(error);
          }
        });
      }
    })
    .catch((err) => res.status(404).json({ error: err }));
};

// Create PIN
exports.setPin = function (req, res) {
  let updatedUserData = req.body;

  User.findByIdAndUpdate(updatedUserData.userId, { $set: updatedUserData })
    .then((user) => {
      res.status(200).json({
        message: "PIN Updated Successfully!",
        user: user._id,
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
};

// -------------------------------Transactions--------------------------
// create New transaction or send IE_Points
exports.createNewTransaction = async function (req, res) {
  try {
    console.log("createTransaction", req.body);
    const { senderId, receiverMobileNumber, amount, note, userType } = req.body;

    const receiver = await User.findOne({
      mobileNumber: receiverMobileNumber,
    }).exec();

    const sender = await User.findOne({
      _id: senderId,
    }).exec();

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    if (sender.IE_Points < amount) {
      return res.status(400).json({ error: "Insufficient IE points" });
    }

    console.log("sender", sender);

    let newTransaction = new Transaction({
      senderId,
      receiverId: receiver._id,
      senderName: sender.name,
      receiverName: receiver.name,
      receiverMobileNumber,
      amount,
      note,
      userType,
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
          data: newTransaction,
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

// Get all transactions
exports.getAllTransaction = function (req, res) {
  Transaction.find()
    .then((transaction) => {
      res.status(200).json({ data: transaction });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

// Get Single transaction details
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

// Get transactions of single user
exports.getTransactionsByUserId = function (req, res) {
  let userId = req.body.userId;
  Transaction.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  })
    .then((transaction) => {
      res.status(200).json({ data: transaction });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};

//  send IE_Vouchers
exports.sendVouchers = async function (req, res) {
  try {
    const { senderId, receiverMobileNumber, voucher, note, userType } =
      req.body;

    const receiver = await User.findOne({
      mobileNumber: receiverMobileNumber,
    }).exec();

    const sender = await User.findOne({
      _id: senderId,
    }).exec();

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    if (sender.IE_Vouchers < voucher) {
      return res.status(400).json({ error: "Insufficient IE_Vouchers" });
    }

    let newTransaction = new Transaction({
      senderId,
      receiverId: receiver._id,
      receiverName: receiver.name,
      receiverMobileNumber,
      voucher,
      note,
      userType,
    });

    // Update sender and receiver voucher points
    sender.IE_Vouchers -= voucher;
    receiver.IE_Vouchers += voucher;

    await sender.save();
    await receiver.save();
    //  await transaction.save();

    Transaction.create(newTransaction)
      .then(() => {
        res.status(200).json({
          success: "true",
          data: newTransaction,
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
