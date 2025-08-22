const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const validateRegistrationForm = require("../validation/validationHelper");
const User = require("../models/User");

// Регистрация обычного пользователя
exports.registerUser = async (req, res) => {
  const { errors, isValid } = validateRegistrationForm(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { login, email, password, firstName, lastName } = req.body;
  try {
    let user = await User.findOne({ $or: [{ email }, { login }] });
    if (user) {
      errors.auth = "Користувач із таким email або логіном вже існує";
      return res.status(400).json(errors);
    }
    const newUser = new User({
      login,
      email,
      password,
      firstName,
      lastName,
      userNo: Date.now().toString(),
      enabled: true
    });
    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Помилка сервера" });
  }
};

// Логин обычного пользователя
exports.loginUser = async (req, res) => {
  const { errors, isValid } = validateRegistrationForm(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { loginOrEmail, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }]
    });
    if (!user) {
      errors.auth = "Невірні облікові дані";
      return res.status(401).json(errors);
    }
    if (!user.enabled) {
      errors.auth = "Користувач вимкнено";
      return res.status(401).json(errors);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.auth = "Невірні облікові дані";
      return res.status(401).json(errors);
    }
    const payload = {
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      login: user.login,
      isAdmin: false
    };
    jwt.sign(
      payload,
      keys.secretOrKey,
      { expiresIn: 3600 * 5 },
      (err, token) => {
        if (err) throw err;
        res.json({ success: true, token: "Bearer " + token });
      }
    );
  } catch (err) {
    return res.status(500).json({ error: "Помилка сервера" });
  }
};

// Получение профиля пользователя
exports.getUserProfile = async (req, res) => {
  try {
    // req.user устанавливается passport после аутентификации
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};
