const express = require("express");
const router = express.Router();
const carController = require("../Controllers/carController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware"); // Import middleware

// Public route for getting all cars (users might need to see them before logging in)
router.get("/getallcars", carController.getAllCars);

// Admin-specific routes
router.post("/addcar", authenticateToken, authorizeAdmin, carController.addCar);
router.put(
  "/editcar",
  authenticateToken,
  authorizeAdmin,
  carController.editCar
);
router.post(
  "/deletecar",
  authenticateToken,
  authorizeAdmin,
  carController.deleteCar
); // Changed to POST here as per your original code, but DELETE is more RESTful.

module.exports = router;
