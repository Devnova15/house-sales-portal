const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const getConfigs = require("../config/getConfigs");
const passport = require("passport");

// Load Customer model
const Customer = require("../models/Customer");

// Load validation helper to validate all received fields
const validateRegistrationForm = require("../validation/validationHelper");

// Controller for admin login
exports.loginAdmin = async (req, res, next) => {
  const { errors, isValid } = validateRegistrationForm(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const loginOrEmail = req.body.loginOrEmail;
  const password = req.body.password;
  const configs = await getConfigs();

  try {
    // Find admin by email or login and isAdmin flag
    const admin = await Customer.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
      isAdmin: true
    });

    // Check for admin
    if (!admin) {
      errors.auth = "Invalid credentials";
      return res.status(401).json(errors);
    }

    // Check if account is enabled
    if (!admin.enabled) {
      errors.auth = "Account is disabled";
      return res.status(401).json(errors);
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      errors.auth = "Invalid credentials";
      return res.status(401).json(errors);
    }

    // Create JWT Payload
    const payload = {
      id: admin.id,
      firstName: admin.firstName || '',
      lastName: admin.lastName || '',
      email: admin.email,
      login: admin.login,
      isAdmin: true
    };

    // Sign Token
    const token = jwt.sign(
      payload,
      keys.secretOrKey,
      { expiresIn: 3600 * 5 } // 5 hours
    );

    res.json({
      success: true,
      token: "Bearer " + token
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Controller for getting current customer
exports.getCustomer = (req, res) => {
  res.json(req.user);
};

// Note: Customer profile editing and password update functionality has been removed
// as per requirements to keep only admin login functionality

// Controller for customer registration
exports.registerCustomer = async (req, res) => {
  const { errors, isValid } = validateRegistrationForm(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const { firstName, lastName, login, email, password, telephone } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({
      $or: [{ email: email }, { login: login }]
    });

    if (existingCustomer) {
      if (existingCustomer.email === email) {
        errors.email = "Користувач з такою електронною поштою вже існує";
      }
      if (existingCustomer.login === login) {
        errors.login = "Користувач з таким логіном вже існує";
      }
      return res.status(400).json(errors);
    }

    // Generate customer number
    const customerCount = await Customer.countDocuments();
    const customerNo = `CUST${String(customerCount + 1).padStart(6, '0')}`;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new customer
    const newCustomer = new Customer({
      customerNo,
      firstName,
      lastName,
      login,
      email,
      password: hashedPassword,
      telephone: telephone || '',
      isAdmin: false,
      enabled: true
    });

    const savedCustomer = await newCustomer.save();

    // Create JWT token for immediate login
    const payload = {
      id: savedCustomer.id,
      firstName: savedCustomer.firstName,
      lastName: savedCustomer.lastName,
      isAdmin: false
    };

    const token = jwt.sign(
      payload,
      keys.secretOrKey,
      { expiresIn: 3600 } // 1 hour
    );

    res.json({
      success: true,
      message: "Реєстрація успішна",
      token: "Bearer " + token,
      customer: {
        id: savedCustomer.id,
        firstName: savedCustomer.firstName,
        lastName: savedCustomer.lastName,
        login: savedCustomer.login,
        email: savedCustomer.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Помилка сервера під час реєстрації"
    });
  }
};

// Controller for customer login
exports.loginCustomer = async (req, res) => {
  const { errors, isValid } = validateRegistrationForm(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const { loginOrEmail, password } = req.body;

    // Find customer by email or login
    const customer = await Customer.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }]
    });

    if (!customer) {
      errors.auth = "Невірні дані для входу";
      return res.status(401).json(errors);
    }

    // Check if account is enabled
    if (!customer.enabled) {
      errors.auth = "Акаунт деактивовано";
      return res.status(401).json(errors);
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, customer.password);
    
    if (!isMatch) {
      errors.auth = "Невірні дані для входу";
      return res.status(401).json(errors);
    }

    // Create JWT Payload
    const payload = {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      isAdmin: customer.isAdmin || false
    };

    // Sign Token
    const token = jwt.sign(
      payload,
      keys.secretOrKey,
      { expiresIn: 3600 } // 1 hour
    );

    res.json({
      success: true,
      token: "Bearer " + token,
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        login: customer.login,
        email: customer.email,
        isAdmin: customer.isAdmin || false
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Помилка сервера під час входу"
    });
  }
};

// Controller for getting current customer - kept for admin functionality
exports.getCustomer = (req, res) => {
  res.json(req.user);
};
