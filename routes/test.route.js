const express = require("express");
const router = express.Router();

const test_controller = require("../controllers/test.controller");

router.get('/', test_controller.getAllTest);
router.post('/getSingleTest', test_controller.getSingleTest);
router.post('/create', test_controller.createTest);
router.post('/update', test_controller.updateTest);
router.post('/delete', test_controller.deleteTest);
router.post('/getTestByIdParams/:id', test_controller.getTestByIdParams);

module.exports = router;