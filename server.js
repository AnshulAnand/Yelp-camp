if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const campground = require('./models/campground');
const Review = require('./models/review');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');
const ejsMate = require('ejs-mate');
const path = require('path');
const express = require('express');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const review = require('./models/review');
const app = express();

mongoose.connect(process.env.MONGOURI, () => console.log('connected to mongodb...'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// using routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
  res.render('home')
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((error, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong :(' } = error;
  if (!error.message) error.message = 'Oh no, something went wrong!';
  res.status(statusCode).render('error', { error });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server running on port ${PORT}`));