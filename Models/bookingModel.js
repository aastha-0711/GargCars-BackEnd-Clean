const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectID, ref: "cars" }, // Reference to a Car document
    user: { type: mongoose.Schema.Types.ObjectID, ref: "users" }, // Reference to a User document
    bookedTimeSlots: {
      // Embedded document for the specific booking's time range
      from: { type: String },
      to: { type: String },
    },
    totalMins: { type: Number },
    totalAmount: { type: Number },
    transactionId: { type: String }, // ID from the payment gateway (e.g., Razorpay)
    driverRequired: { type: Boolean },
    address: { type: String }, // Pickup/drop-off address
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const bookingModel = mongoose.model("bookings", bookingSchema); // Creates the Mongoose model
module.exports = bookingModel;
