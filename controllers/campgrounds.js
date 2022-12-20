const campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});

// get all campgrounds
module.exports.index = async (req, res) => {
  const campgrounds = await campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

// render new campground form
module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

// create new campground
module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  const camp = new campground(req.body.campground);
  camp.geometry = geoData.body.features[0].geometry;
  camp.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
  camp.author = req.user._id;
  await camp.save();
  console.log(camp);
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${camp._id}`);
};

// show campground
module.exports.showCampground = async (req, res) => {
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

// render edit campground form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  if (!camp) {
    req.flash('error', 'Cannot find campground.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { camp });
};

// update campground
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findByIdAndUpdate(id, { ...req.body.campground });
  if (req.files) {
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    camp.images.push(...imgs);
  }
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      // await cloudinary.uploader.destroy(filename);
      for (let i = 0; i < camp.images.length; i++) {
        if (camp.images[i].filename == filename) camp.images.splice(i, 1);
      }
    }
    // camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
  }
  await camp.save();
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${camp._id}`);
};

// delete campground
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  req.flash('success', 'Campground deleted');
  res.redirect('/campgrounds');
};