const User = require("../Models/userModal");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For JWT operations

// Registration (with password hashing)
exports.register = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt (random string)
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    // 3. Create new user with hashed password
    const newuser = new User({
      username,
      email,
      phone,
      password: hashedPassword, // Store the hashed password
      admin: false, // Ensure new registrations are not admins by default
    });

    await newuser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error); // Log the full error for debugging
    res.status(500).json({ error: "Something went wrong during registration" }); // Generic message for client
  }
};

// Login (with password comparison and JWT generation)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user by email (we need the password field, so use .select('+password'))
    const user = await User.findOne({ email }).select("+password"); // Explicitly select password field

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      admin: user.admin,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour (adjust as needed)
    );

    // 4. Send token and user info (WITHOUT password)
    res.json({
      message: "Login successful",
      token,
      user: {
        // Send only necessary user data
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        admin: user.admin,
      },
    });
  } catch (error) {
    console.error("Login error:", error); // Log the full error for debugging
    res.status(500).json({ error: "Something went wrong during login" }); // Generic message for client
  }
};
