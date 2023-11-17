const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    name: { type: String, required: true, max: 100 },
    mobileNumber: { type: Number, required: true },
    email: { type: String, required: true }, //remove whitespace from begin and end
    password: {
      type: String,
      required: true,
    },
    setPassword: { type: Boolean, default: false },
    userType: {
      type: String,
      enum: ["INDIVIDUAL", "MERCHANT", "ADMIN", "SUPERADMIN"],
      default: "INDIVIDUAL",
      required: true,
    },
    pin: { type: String, required: false },
    setPin: { type: Boolean, default: false },
    age: { type: String, required: false },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Use an enum for specific values
      required: false,
    },
    address: {
      type: String,
    },
    kyc: { type: Boolean, default: false },
    acceptTerms: { type: Boolean, required: true, default: false },
    IE_Points: { type: Number, required: true, default: 0 },
    IE_Vouchers: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model("User", UserSchema);
