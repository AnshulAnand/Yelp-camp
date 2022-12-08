require('dotenv').config();
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mongoose = require('mongoose');
const campground = require('../models/campground');

mongoose.connect(process.env.MONGOURI, () => console.log('connected to mongodb...'));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new campground({
      author: '6391a5d51e8c00cbba0b9802',
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: 'https://source.unsplash.com/collection/483251',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta ea veritatis est unde eum ipsa molestiae a ab repellendus natus.',
      price: 20000,
    });
    await camp.save();
  };
};

seedDB();