const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    name: { type: String, required: true, max: 100 },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true, unique: true, trim: true }, //remove whitespace from begin and end
    password: {
      type: String,
      required: true,
    },
    setPassword: {type: Boolean, default: false},
    userType: {
      type: String,
      enum: ["INDIVIDUAL", "MERCHANT"],
      default: "INDIVIDUAL",
      required: true,
    },
    pin: { type: String, required: false },
    setPin: { type: Boolean, default: false },
    age: { type: String, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Use an enum for specific values
      required: true,
    },
    kyc: { type: Boolean, default: false },
    acceptTerms: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model("User", UserSchema);
