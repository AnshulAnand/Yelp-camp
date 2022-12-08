const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const campgrounds = await campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const camp = new campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.get(
  '/:id',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const camp = await campground
      .findById(req.params.id)
      .populate('author')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author'
        }
      });
    if (!camp) {
      req.flash('error', 'Cannot find campground.');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    if (!camp) {
      req.flash('error', 'Cannot find campground.');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
  })
);

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  '/:id/delete',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
