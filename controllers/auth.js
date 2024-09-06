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

exports.postLogin = (req, res, next) => {
  User.findById('66d822f09118fd934ff67a7a')
  .then(user => {
    req.session.user = user
    req.session.isLoggedIn = true;
    req.session.save(err => {
      console.log('Error', err)
      res.redirect('/')
    })
  })
    .catch((err) => {
    console.log('Error Find User', err)
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log('Error Logging out', err)
    res.redirect('/')
  })
}