const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors'); // Добавляем импорт CORS
require('dotenv').config();

const globalConfigs = require('./routes/globalConfigs');
const customers = require('./routes/customers');
const catalog = require('./routes/catalog');
const products = require('./routes/products');
const colors = require('./routes/colors');
const sizes = require('./routes/sizes');
const filters = require('./routes/filters');
const subscribers = require('./routes/subscribers');
const cart = require('./routes/cart');
const orders = require('./routes/orders');
const links = require('./routes/links');
const pages = require('./routes/pages');
const slides = require('./routes/slides');
const wishlist = require('./routes/wishlist');
const comments = require('./routes/comments');
const shippingMethods = require('./routes/shippingMethods');
const paymentMethods = require('./routes/paymentMethods');
const partners = require('./routes/partners');
const houses = require('./routes/houses'); // Добавляем импорт маршрутов для домов
// const mainRoute = require('./routes/index');

const app = express();

// Включаем CORS для всех маршрутов (добавляем перед другими middleware)
app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Добавьте эту строку в server.js после определения app
app.use(express.static(path.join(__dirname, 'public')));

// Если вам также нужно указать конкретные пути для статики
app.use('/images', express.static(path.join(__dirname, 'public/images')));
// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
// Connect to MongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        connectTimeoutMS: 30000, // Увеличиваем таймаут
        socketTimeoutMS: 45000   // Увеличиваем таймаут сокета
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB Connection Error:', err));

// Добавьте обработчики событий для MongoDB
mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// В server.js добавьте перед другими маршрутами
app.get('/test-static', (req, res) => {
  const testImagePath = path.join(__dirname, 'public/images/placeholder-house.jpg');
  const housesPath = path.join(__dirname, 'public/images/houses');
  
  const exists = {
    placeholderExists: require('fs').existsSync(testImagePath),
    housesDirExists: require('fs').existsSync(housesPath),
    filesInHousesDir: require('fs').existsSync(housesPath) 
      ? require('fs').readdirSync(housesPath)
      : []
  };
  
  res.json({
    staticConfig: {
      publicPath: path.join(__dirname, 'public'),
      imagesPath: path.join(__dirname, 'public/images')
    },
    exists: exists,
    env: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT || 5001
    }
  });
});

// Use Routes
app.use('/api/configs', globalConfigs);
app.use('/api/customers', customers);
app.use('/api/catalog', catalog);
app.use('/api/products', products);
app.use('/api/colors', colors);
app.use('/api/sizes', sizes);
app.use('/api/filters', filters);
app.use('/api/subscribers', subscribers);
app.use('/api/cart', cart);
app.use('/api/orders', orders);
app.use('/api/links', links);
app.use('/api/pages', pages);
app.use('/api/slides', slides);
app.use('/api/wishlist', wishlist);
app.use('/api/comments', comments);
app.use('/api/shipping-methods', shippingMethods);
app.use('/api/payment-methods', paymentMethods);
app.use('/api/partners', partners);
app.use('/api/houses', houses); // Добавляем маршруты для домов
// app.use('/', mainRoute);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));