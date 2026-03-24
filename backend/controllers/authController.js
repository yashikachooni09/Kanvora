const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//signup

exports.signup = async (req, res) => {
  try {
    const { fname, lname, password, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ message: "User already exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.json({ message: "Signup Successfully" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

//login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Inavalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};
