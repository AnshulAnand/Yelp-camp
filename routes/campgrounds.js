const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../schemas');
const express = require('express');
const router = express.Router();

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get('/', async (req, res) => {
  const campgrounds = await campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

router.post(
  '/',
  validateCampground,
  catchAsync(async (req, res, next) => {
    const camp = new campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const camp = await campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { camp });
  })
);

router.get(
  '/:id/edit',
  catchAsync(async (req, res) => {
    const camp = await campground.findById(req.params.id);
    res.render('campgrounds/edit', { camp });
  })
);

router.put(
  '/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.body;
    const camp = await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  '/:id/delete',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);

module.exports = router;
