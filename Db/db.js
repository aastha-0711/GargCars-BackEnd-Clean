require("dotenv").config();
const mongoose = require("mongoose");

function connectDb() {
  mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const connection = mongoose.connection;
  connection.on("connected", () => {
    console.log("Connection successful");
  });
  connection.on("error", () => {
    console.log("Connection failed");
  });
}

connectDb();
module.exports = mongoose;
