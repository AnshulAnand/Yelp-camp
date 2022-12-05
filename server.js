if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const express = require('express');
const app = express();

mongoose.connect(process.env.MONGOURI, () => console.log('connected to mongodb...'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.post('/campgrounds', catchAsync(async (req, res, next) => {
  const camp = new campground(req.body.campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const camp = await campground.findById(req.params.id);
  res.render('campgrounds/show', { camp });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const camp = await campground.findById(req.params.id);
  res.render('campgrounds/edit', {camp});
}));

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.body;
  const camp = await campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

app.use((error, req, res, next) => {
  res.send('Something went wrong!');
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server running on port ${PORT}`));