const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ SIGNUP
exports.signup = async (req, res) => {
  try {
    const { fname, lname, password, email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.json({
      success: true,
      message: "Signup Successful"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};