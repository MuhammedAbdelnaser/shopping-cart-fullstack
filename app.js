const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

const errorController = require('./controllers/error');

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

const csrfProtection = csrf();
app.use(flash())

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(csrfProtection);

app.use((req, res, next) => {
  if(!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
  .then(user => {
    if (!user) {
      return next()
    }
    req.user = user;
    next()
  })
  .catch((err) => {
    throw new Error(err);
    
  });
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next()
})

app.use('/admin',   adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// app.use(errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.redirect('/500')
})

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  app.listen(3000)
}).catch((err) => {
  console.log('ERROR CONNECTING', err)
});

// * OLD CODE USING MONGODB
/*
  const mongoConnect = require('./utils/database').mongoConnect;
  const User = require('./models/user');
  mongoConnect(() => {
    app.listen(3000)
  })
 */