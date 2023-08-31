const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.pluralize(null);
mongoose.set("strictQuery", true);

// const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;
// const MONGO_URI = `mongodb://127.0.0.1:27017/ie-app-backend`;

//Connect to Mongo DB
const connect = async () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", (error) => {
    console.log(error);
  });
  db.once("open", () => {
    console.log("Successfully connect to MongoDB.");
  });
};
module.exports = { connect };
