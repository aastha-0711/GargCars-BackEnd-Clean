const express = require("express");
const path = require("path");
const app = express();
const dbConnection = require("./Db/db");
var cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Middleware
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://checkout.razorpay.com",
        ], // IMPORTANT: Add Razorpay domain for its script
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.razorpay.com"], // IMPORTANT: Allow connection to Razorpay API
        // Add other directives as needed for your application
      },
    },
  })
);
app.use(express.json());

const port = process.env.PORT || 8000;

// Test route (optional)
app.get("/hello", (req, res) => {
  res.send("Hello!");
});

// Use your route modules
app.use("/api/cars/", require("./Routes/carsRoutes"));
app.use("/api/users/", require("./Routes/usersRoutes"));
app.use("/api/bookings/", require("./Routes/bookingsRoute")); // Corrected to match the module export name

// Remove these redundant routes unless absolutely necessary, and ensure your frontend calls the canonical paths.
// If you MUST keep them for some reason, they will still be protected by the middleware on the actual route handlers.
// app.use("/booking/api/cars/", require("./Routes/carsRoutes"));
// app.use("/editcar/api/cars/", require("./Routes/carsRoutes"));
// app.use("/booking/api/bookings/", require("./Routes/bookingRoute"));

// This block is for serving your frontend application in production.
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(port, () => {
  console.log(`Server is running at port: ${port} `);
});
