// import collection model
const User = require("../models/user.model");
const bcrypt = require("bcrypt");


//Get All Users
exports.getAllUsers = async function (req, res) {
    const data = await User.find();
    res.status(200).json(data);
  };

  
// Register User
exports.registerUser = async function (req, res) {
  const data = req.body;
  console.log("user req body:", data);

  const {
    name,
    phoneNumber,
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
  } = data;

  await bcrypt
    .genSalt(10)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      const hashedPassword = hash;

      if (!name || !email || !password || !phoneNumber || !userType) {
        res.status(400).send({ error: "All fields are required", data });
      } else {
        //   find if user exists
        User.findOne({ phoneNumber }).then((user) => {
          if (user) {
            error = "User Already Exists";
            return res.status(400).json({ error });
          } else {
            const newUser = new User({
              name,
              phoneNumber,
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
    const { phoneNumber, password } = req.body;
    console.log("login data: ", req.body);
  
    User.findOne({ phoneNumber })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User Not Found" });
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
