const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

app.use((req, res, next) => {
  User.findById('66d822f09118fd934ff67a7a')
  .then(user => {
    req.user = user
    next()
  }).catch((err) => {
    console.log('Error Find User', err)
  });
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  User.findOne().then(users => {
    if (!users) {
      const user = new User({
        name: 'Muhammed',
        email: 'Muhammed@me.com',
        cart: {
          items: []
        }
      })
      user.save();
    }
  })
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