// import collection model
const Test = require("../models/test.model");

//get all
exports.getAllTest = function (req, res) {
  // res.send('Greetings from the Test controller!');

  Test.find()
    .then((test) => {
      res.status(200).json({ data: test });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

// get single data by ID
exports.getSingleTest = function (req, res) {
  let testID = req.body.testID;
  Test.findById(testID)
    .then((test) => {
      res.status(200).json({ data: test });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};

// write test
exports.createTest = function (req, res) {
  const data = req.body;
  console.log("data: ", data);
  let newTest = new Test({
    name: data.name,
    price: data.price,
  });

  Test.create(newTest)
    .then(() => {
      res.status(200).json({
        success: "true",
        data: "created",
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

// update test by id
exports.updateTest = function (req, res) {
  let testID = req.body.testID;

  let updatedTestData = {
    name: req.body.name,
    price: req.body.price,
  };

  Test.findByIdAndUpdate(testID, { $set: updatedTestData })
    .then((test) => {
      res.status(200).json({
        message: "Updated Successfully!",
        data: test,
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
};

// delete
exports.deleteTest = function (req, res) {
  let testID = req.body.testID;

  Test.findByIdAndRemove(testID)
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

// Get test by ID in Params
exports.getTestByIdParams = async function (req, res) {
  const id = req.params.id;

  Test.findById(id)
    .then((test) => {
      res.status(200).json({
        success: "true",
        data: test,
      });
    })
    .catch((err) => res.status(400).json({ error: err }));
};
