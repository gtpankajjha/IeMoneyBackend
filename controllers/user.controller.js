// import collection model
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
exports.registerUser = async function (req, res) {
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

// Login User
exports.loginUser = async function (req, res) {
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

// Set PIN details
exports.setPin = function (req, res) {
  // let data = req.body;
  let updatedUserData = req.body;

  // let updatedUserData = {
  //   first_name: data.first_name,
  //   last_name: data.last_name,
  //   email: data.email,
  //   password: data.password,
  //   mobile: data.mobile,
  //   userType: data.userType,
  //   acceptTerms: data.acceptTerms,
  //   about: data.about,
  //   kyc: data.kyc,
  // };

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

// verify PIN
exports.verifyPin = async function (req, res) {
  try {
    const { userId, enteredPin } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the entered PIN with the stored PIN
    if (enteredPin === user.pin) {
      res.json({ message: "PIN is valid", valid: true });
    } else {
      res.status(401).json({ error: "Invalid PIN", valid: false });
    }
  } catch (error) {
    console.error("Error verifying PIN:", error);
    res.status(500).json({ error: "Server error" });
  }
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

// delete
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
