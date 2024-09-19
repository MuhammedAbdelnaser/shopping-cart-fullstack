const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
const User = require("../models/user");
const e = require('connect-flash');
require('dotenv').config();

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
      api_key: process.env.SENDGRID_API_KEY
  }
}))

exports.getLogin = (req, res, next) => {
  const errors = validationResult(req)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: errors.array()[0]?.msg,
    oldInput: { email: '', password: '' },
    validationErrors: []
  });
};
exports.getSignup = (req, res, next) => {
  const errors = validationResult(req)
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    isAuthenticated: false,
    errorMessage: errors.array()[0]?.msg,
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: []
  });
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
      errorMessage: errors.array()[0]?.msg,
      oldInput: { email, password },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email })
  .then(user => {
    if (!user) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: 'Invalid email or password',
        oldInput: { email, password },
        validationErrors: []
      });
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
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: errors.array()[0]?.msg,
        oldInput: { email, password },
        validationErrors: errors.array()
      });
    }).catch((err) => {
      
    });
  })
    .catch((err) => {
    console.log('Error Find User', err)
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body
  const errors = validationResult(req)
  console.log('errors.array()', errors.array())
  if (!errors.isEmpty()) 
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Sign Up',
      errorMessage: errors.array()[0],
      oldInput: { email, password, confirmPassword: req.body.confirmPassword },
      validationErrors: errors.array()
    });

    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email,
          password: hashedPassword,
          cart: { items: [] }
        })
        console.log('user', user)
        return user.save()
      })
      .then(() => {
        res.redirect('/')
        return transporter.sendMail({
          to: email,
          from: 'scimuhammedabdelnaser@gmail.com',
          subject: 'Sign up Succeeded!',
          html: '<h1>You Successfully signed up!</h1>'
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

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null;
  }
  res.render('auth/reset-password', {
    path: '/reset-password',
    pageTitle: 'Reset Your Password',
    errorMessage: message
  })
}

exports.postReset = (req, res, next) => {
  const { email } = req.body
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/reset-password');
    }
    const token = buffer.toString('hex')
    User.findOne({ email }).then(user => {
      if (!user) {
        req.flash('error', 'No Account with that email found')
        return res.redirect('/reset-password')
      }
      user.resetPasswordToken = token
      user.resetPasswordTokenExpiration = Date.now() + (1000 * 60 * 60);
      user.save()
    })
    .then(() => {
      transporter.sendMail({
        to: req.body.email,
        from: 'scimuhammedabdelnaser@gmail.com',
        subject: 'Password reset',
        html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
        `
      })
    })
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      console.log('Error Resetting Password');
    });
  })
}

exports.getResetNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiration: { $gt: Date.now()}})
  .then(user => {
    let message = req.flash('error')
    if (message.length > 0) {
      message = message[0]
    } else {
      message = null;
    }
    res.render('auth/reset-new-password', {
      path: '/reset-new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      passwordToken: token,
      userId: user._id
    })
  }).catch((err) => {
    console.log('Error', err);
  });
}

exports.postResetNewPassword = (req, res, next) => {
  const { password: newPassword, userId, passwordToken } = req.body;
  let resetUser;

  User.findOne({
    resetPasswordToken: passwordToken,
    resetPasswordTokenExpiration: { $gt: Date.now()},
    _id: userId
  })
  .then(user => {
    resetUser = user
    return bcrypt.hash(newPassword, 12);
  }).then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordTokenExpiration = undefined;
    return resetUser.save();
  }).then(result => {
    res.redirect('/login')
  }).catch((err) => {
    console.log('Error Resetting Password post method', err);
  });
}
