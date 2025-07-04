const express = require("express");
const path = require("path");
const app = express();
const dbConnection = require("./Db/db"); // Assuming this connects to your DB
var cors = require("cors");
const helmet = require("helmet"); // Import helmet
require("dotenv").config();
app.use(cors());

// Configure Helmet with a Content Security Policy
// This policy allows resources from the same origin ('self')
// and specifically allows data: URIs for fonts if you're embedding them,
// and 'unsafe-inline' for styles (use with caution, but often needed for development)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Allow resources from the same origin
        fontSrc: ["'self'", "data:"], // Allow fonts from same origin and data URIs
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from same origin and inline styles
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts from same origin and inline scripts
        imgSrc: ["'self'", "data:", "https:"], // Allow images from same origin, data URIs, and HTTPS
        connectSrc: ["'self'"], // Allow connections (XHR, WebSockets) from same origin
        // Add other directives as needed for your application
      },
    },
  })
);

app.use(express.json());

const port = process.env.PORT || 8000;

app.get("/hello", (req, res) => {
  res.send("Hello!");
});

app.use("/api/cars/", require("./Routes/carsRoutes"));
//refresh error
app.use("/booking/api/cars/", require("./Routes/carsRoutes"));
app.use("/editcar/api/cars/", require("./Routes/carsRoutes"));
app.use("/api/users/", require("./Routes/usersRoutes"));
app.use("/booking/api/bookings/", require("./Routes/bookingsRoute"));
app.use("/api/bookings/", require("./Routes/bookingsRoute"));

// This block is for serving your frontend application in production.
// If you have a React/frontend app, you'll need to build it first.
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(port, () => {
  console.log(`Server is running at port: ${port} `);
});
