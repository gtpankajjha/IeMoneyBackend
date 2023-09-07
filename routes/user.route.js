const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

router.get('/', user_controller.getAllUsers);
router.get('/userid', user_controller.getUserById);
router.post('/create', user_controller.registerUser);
router.post('/login', user_controller.loginUser);
router.post('/setpin', user_controller.setPin);
router.post('/verifypin', user_controller.verifyPin);
router.post('/updateUser', user_controller.updateUser);

module.exports = router;
