const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/bookingController");
const { authenticateToken } = require("../middleware/authMiddleware"); // Import middleware

router.post("/bookcar", authenticateToken, bookingController.bookCar); // Protect this route
router.get(
  "/getallbookings",
  authenticateToken,
  bookingController.getAllBookings
); // Protect this route

module.exports = router;
