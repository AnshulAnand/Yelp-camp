if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const express = require('express');
const app = express();

const MongoDBStore = require('connect-mongo')(session);

// require models
const User = require('./models/user');

// require routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const users = require('./routes/users');

// storing environment variables
const secret = process.env.SECRET || 'secret'
const MONGOURI = process.env.MONGOURI

// connect to mongodb
mongoose.connect(MONGOURI, () => console.log('connected to mongodb...'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({ replaceWith: '_', }));

const store = new MongoDBStore({
  url: MONGOURI,
  secret: secret,
  touchAfter: 24 * 60 * 60,
});

store.on('error', e => {
  console.log('Session store error (server.js)', e);
});

const sessionConfig = {
  store: store,
  name: 'session',
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// using routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use('/', users);

// rendering home page
app.get('/', (req, res) => {
  res.render('home')
});

// displaying error if user visits any other route
app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((error, req, res, next) => {
  const { statusCode = 500 } = error;
  if (!error.message) error.message = 'Oh no, something went wrong :(';
  res.status(statusCode).render('error', { error });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server running on port ${PORT}`));