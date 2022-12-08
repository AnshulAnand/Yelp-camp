const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const express = require('express');
const router = express.Router();

router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
  .get(isLoggedIn, catchAsync(campgrounds.showCampgrounds))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router.get(
  '/:id/delete',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
