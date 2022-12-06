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
const review = require('./models/review');
const app = express();

mongoose.connect(process.env.MONGOURI, () => console.log('connected to mongodb...'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else { next() };
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else { next() };
};

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
  const camp = new campground(req.body.campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const camp = await campground.findById(req.params.id).populate('reviews');
  console.log(camp);
  res.render('campgrounds/show', { camp });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const camp = await campground.findById(req.params.id);
  res.render('campgrounds/edit', {camp});
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.body;
  const camp = await campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const camp = await campground.findById(req.params.id);
  const review = new Review(req.body.review);
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync( async (req, res) => {
  const { id, reviewId } = req.params;
  campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
}));

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