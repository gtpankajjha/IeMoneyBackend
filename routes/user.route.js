const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

router.get('/', user_controller.getAllUsers);
router.post('/create', user_controller.registerUser);
router.post('/login', user_controller.loginUser);

module.exports = router;
