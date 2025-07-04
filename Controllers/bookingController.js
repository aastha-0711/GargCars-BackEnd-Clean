require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const Booking = require("../Models/bookingModel");
const Car = require("../Models/carModel");

exports.bookCar = async (req, res) => {
  const { token } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: req.body.totalAmount * 100,
        currency: "pkr", // you can change to "inr" or other if needed
        customer: customer.id,
        receipt_email: token.email,
        description: "Software development services",
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      req.body.transactionId = payment.source.id;

      const newBooking = new Booking(req.body);
      await newBooking.save();

      const car = await Car.findById(req.body.car);
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await car.save();

      res.send("Your booking is successful");
    } else {
      return res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(400).json(error);
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("car").populate("user");
    res.send(bookings);
  } catch (error) {
    console.error("Fetching bookings failed:", error);
    return res.status(400).json(error);
  }
};
