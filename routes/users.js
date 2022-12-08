const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post(
  '/register', catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({email, username});
      const registerdUser = await User.register(user, password);
      // console.log(registerdUser);
      req.login(registerdUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
      });
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/register');
    }
  }
));

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo ? req.session.returnTo : '/';
    // console.log(req.session, req.session.returnTo, redirectUrl);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
  req.logout(err =>  {
    if (err) return next(err);
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
  });
});

module.exports = router;