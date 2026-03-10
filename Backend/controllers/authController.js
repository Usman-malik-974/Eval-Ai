const User = require("../models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/sendMail");
const validator = require("validator");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password too short" });
  }

  try {
    const existingUser = await User.findOne({ email });

    // ✅ If verified user exists → block
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Generate verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    let user;

    // ✅ If unverified user exists → update instead of creating new
    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.password = hashed;
      existingUser.verificationToken = token;

      user = await existingUser.save();
    } else {
      // ✅ Create new user
      user = await User.create({
        name,
        email,
        password: hashed,
        isVerified: false,
        verificationToken: token,
      });
    }

    const link = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

    await sendVerificationEmail(
      email,
      "Verify your account",
      `
  <p>Click the button below to verify your account:</p>
  <a href="${link}" 
     style="
       display:inline-block;
       padding:10px 20px;
       background:#2563eb;
       color:white;
       text-decoration:none;
       border-radius:5px;
       cursor-pointer;
     ">
     Verify Email
  </a>
  <p>If the button doesn't work, copy and paste this link:</p>
  <p>${link}</p>
  `
    );

    res.status(200).json({
      message: "Verification email sent. Please verify your account.",
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isVerified) {
    return res.status(403).json({
      message: "Please verify your email first",
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token, user: {
      name: user.name,
      role: user.role,
    }
  });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    res.send("Email verified successfully");
  } catch {
    res.status(400).send("Verification failed");
  }
};