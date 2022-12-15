const campground = require('../models/campground');
const Review = require('../models/review');

// create review
module.exports.createReview = async (req, res) => {
  const camp = await campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash('success', 'Created new review!');
  res.redirect(`/campgrounds/${camp._id}`);
};

// delete review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted.');
  res.redirect(`/campgrounds/${id}`);
};