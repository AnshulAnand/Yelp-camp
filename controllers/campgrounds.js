const campground = require('../models/campground');

module.exports.index = async (req, res) => {
  const campgrounds = await campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const camp = new campground(req.body.campground);
  camp.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
  camp.author = req.user._id;
  await camp.save();
  console.log(camp)
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCampgrounds = async (req, res) => {
  const camp = await campground
    .findById(req.params.id)
    .populate('author')
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    });
  if (!camp) {
    req.flash('error', 'Cannot find campground.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { camp });
};

module.exports.renderEditForm = async (req, res) => {
  if (!camp) {
    req.flash('error', 'Cannot find campground.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { camp });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  req.flash('success', 'Campground deleted');
  res.redirect('/campgrounds');
};