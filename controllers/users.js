const User = require('../models/user');
const { sendEmail } = require('../utils/sendEmail');

// render register form
module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

// registering user
module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registerdUser = await User.register(user, password);
    req.login(registerdUser, err => {
      if (err) return next(err);
      sendEmail(username, email);
      req.flash('success', 'Welcome to YelpCamp!');
      res.redirect('/campgrounds');
    });
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
};

// render login form
module.exports.renderLogin = (req, res) => {
  res.render('users/login');
}

// loging user in
module.exports.login = (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// logout user
module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  });
};