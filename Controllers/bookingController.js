require("dotenv").config();
const Razorpay = require("razorpay");
const Booking = require("../Models/bookingModel");
const Car = require("../Models/carModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.bookCar = async (req, res) => {
  try {
    const {
      user,
      car,
      totalMins,
      totalAmount,
      driverRequired,
      bookedTimeSlots,
    } = req.body;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      bookingDetails: {
        user,
        car,
        totalMins,
        totalAmount,
        driverRequired,
        bookedTimeSlots,
      },
    });
  } catch (error) {
    console.error("Razorpay booking error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ✅ This is missing — add this
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("car").populate("user");
    res.send(bookings);
  } catch (error) {
    console.error("Fetching bookings failed:", error);
    res.status(400).json(error);
  }
};
