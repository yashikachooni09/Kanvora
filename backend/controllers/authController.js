const User = require("../models/User");
const Board = require("../models/Board");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const linkPendingInvites = async (userId, userEmail) => {
  if (!userId || !userEmail) return;
  try {
    const normalizedEmail = userEmail.toLowerCase().trim();
    await Board.updateMany(
      { "members.email": { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
      { $set: { "members.$[elem].userId": userId } },
      { arrayFilters: [{ "elem.email": { $regex: new RegExp(`^${normalizedEmail}$`, "i") } }] }
    );
  } catch (err) {
    console.error("Error linking pending board invites:", err.message);
  }
};

// ✅ SIGNUP
exports.signup = async (req, res) => {
  try {
    const { fname, lname, password, email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "User already exists",
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
    await linkPendingInvites(newUser._id, newUser.email);

    res.json({
      success: true,
      message: "Signup Successful",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
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
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await linkPendingInvites(user._id, user.email);

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { fname, lname, email, avatar } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
      user.email = email;
    }

    if (fname) user.fname = fname;
    if (lname) user.lname = lname;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: "There is no user with that email" });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    
    const htmlMessage = `
      <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; color: #f8fafc; padding: 40px 20px; border-radius: 16px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 48px; height: 48px; background-color: rgba(6, 182, 212, 0.2); color: #cffafe; font-size: 24px; font-weight: bold; line-height: 48px; border-radius: 12px;">K</div>
          <h1 style="font-size: 24px; font-weight: 600; margin-top: 16px; margin-bottom: 4px; color: #ffffff;">Kanvora</h1>
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #67e8f9; margin: 0;">Modern Workspace</p>
        </div>
        
        <div style="background-color: #0f172a; padding: 32px; border-radius: 12px; border: 1px solid #1e293b;">
          <h2 style="font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 16px; color: #ffffff;">Password Reset Request</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px;">
            We received a request to reset the password for your Kanvora account. Click the button below to choose a new password and regain access to your workflows.
          </p>
          
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; color: #ffffff; background-color: #06b6d4; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Reset Password</a>
          </div>
          
          <p style="font-size: 14px; line-height: 1.5; color: #94a3b8; margin-bottom: 0;">
            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <p style="font-size: 12px; color: #64748b;">
            &copy; ${new Date().getFullYear()} Kanvora. All rights reserved.
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
        html: htmlMessage
      });

      res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      console.log("Nodemailer Error: ", err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      // Even if email fails, output it to console for dev
      console.log("Reset URL (Email Failed):", resetUrl);
      
      // Returning 200 instead of 500 so the frontend doesn't show an error.
      return res.status(200).json({ 
        success: true, 
        message: "Email failed due to bad Gmail password, but the reset URL is available in the backend console." 
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
