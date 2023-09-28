const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const transporter = require('../config/smtp_email_sender.js');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify the user's password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Credentials validated successfully', user: user});
  } catch (error) {
    res.status(500).json({ error: 'Validation failed' });
  }
};

exports.generateTwoFactorOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate an OTP (e.g., 6-digit code)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP in the user's document in the database
    user.otp = otp;
    await user.save();

    // Send the OTP to the user's email address
    const two_factor_admin_email = process.env.TWO_FACTOR_ADMIN_EMAIL
    await transporter.sendMail({
      from: two_factor_admin_email,
      to: user.email,
      subject: 'One-Time Password (OTP)',
      text: `Your Two Factor authentication OTP is: ${otp}`
    });

    res.status(200).json({ message: 'OTP generated and sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate OTP' });
  }
};

exports.validateTwoFactorOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate the OTP
    if (otp != user.otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    // Generate a JWT token
    try {
      const secret_key = process.env.SECRET_KEY
      const token = jwt.sign({ user:user}, secret_key, { expiresIn: '1h' });
      res.status(200).json({ token, user:user });
    } catch (error) {
      res.status(500).json({ error: 'JWT Token Generation failed: ' + error});
    }
  } catch (error) {
    res.status(500).json({ error: 'OTP validation failed' });
  }
};

exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;
  const nodemailer = require('nodemailer');

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      role: role | 'admin'
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: ' + error });
  }
};
