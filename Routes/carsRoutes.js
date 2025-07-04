const express = require("express");
const router = express.Router();
const carController = require("../Controllers/carController");

router.get("/getallcars", carController.getAllCars); // note: capital 'C'
router.post("/addcar", carController.addCar);
router.put("/editcar", carController.editCar);
router.post("/deletecar", carController.deleteCar);

module.exports = router;
