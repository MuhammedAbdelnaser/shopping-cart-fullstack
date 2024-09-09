const bcrypt = require('bcryptjs');

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true'
  // const isLoggedIn = true
  console.log('Session', req.session)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.user
  });
};
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    isAuthenticated: false
  });
}

exports.postLogin = (req, res, next) => {
  const {email, password } = req.body
  User.findOne({ email })
  .then(user => {
    if (!user) {
      return res.redirect('/')
    }
    bcrypt.compare(password, user.password)
    .then(doMatch => {
      if (doMatch) {
        req.session.user = user
        req.session.isLoggedIn = true;
        return req.session.save(err => {
          console.log('Error', err)
          res.redirect('/')
        })
      }
      res.redirect('/login')
    }).catch((err) => {
      
    });
  })
    .catch((err) => {
    console.log('Error Find User', err)
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({
    email
  })
  .then(userDoc => {
    if(userDoc) {
      return res.redirect('/signup')
    }
    return bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] }
      })
      console.log('user', user)
      return user.save()
    })
    .then(result => {
      res.redirect('/')
    })
  })
  .catch(err => {
    console.log('Error', err)
  });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log('Error Logging out', err)
    res.redirect('/')
  })
}