const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TransactionSchema = new Schema(
  {
    // senderId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },

    receiverName: {
      type: String,
      required: true,
    },

    receiverMobileNumber: {
      type: Number,
      required: true,
    },

    userType: {
      type: String,
      enum: ["INDIVIDUAL", "MERCHANT", "ADMIN", "SUPERADMIN"],
      default: "INDIVIDUAL",
      required: true,
    },

    amount: { type: Number, required: true },
    voucher: { type: Number },
    note: { type: String },
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model("Transaction", TransactionSchema);
