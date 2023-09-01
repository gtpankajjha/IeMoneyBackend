const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TransactionSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverMobileNumber: {
      type: Number,
      required: true,
    },

    amount: { type: Number, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model("Transaction", TransactionSchema);
