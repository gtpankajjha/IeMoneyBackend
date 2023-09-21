const express = require("express");
const router = express.Router();

const admin_controller = require("../controllers/admin.controller");

router.get("/all-users", admin_controller.getAllUsers);
router.get("/user-by-id", admin_controller.getUserById);
router.post("/user-by-mobile-number", admin_controller.getUserByMobileNumber);
router.post("/register-new-user", admin_controller.registerNewUser);
router.post("/update-user", admin_controller.updateUser);
router.post("/delete-user", admin_controller.deleteUser);
router.post("/admin-login", admin_controller.loginAdmin);
router.post("/create-pin", admin_controller.setPin);
router.post("/create-new-transaction", admin_controller.createNewTransaction);
router.post("/all-transactions", admin_controller.getAllTransaction);
router.post(
  "/transaction-by-transact-id",
  admin_controller.getTransactionByTransactId
);
router.post(
  "/transaction-by-user-id",
  admin_controller.getTransactionsByUserId
);

// router.get("/all-users", user_controller.getAllUsers);
// router.get("/userid", user_controller.getUserById);
// router.post("/create", user_controller.registerUser);
// router.post("/login", user_controller.loginUser);
// router.post("/setpin", user_controller.setPin);
// router.post("/verifypin", user_controller.verifyPin);
// router.post("/updateUser", user_controller.updateUser);
// router.post("/deleteUser", user_controller.deleteUser);

module.exports = router;
