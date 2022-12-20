require('dotenv').config();
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mongoose = require('mongoose');
const campground = require('../models/campground');

mongoose.connect(process.env.MONGOURI, () => console.log('connected to mongodb...'));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 15; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new campground({
      author: '6390588fdb2471d9940bb1ad', // authors _id
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      images: [
        {
          url: 'IMAGE_URL_FROM_CLOUDINARY',
          filename: 'FILENAME_FROM_CLOUDINARY',
        }
      ],
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta ea veritatis est unde eum ipsa molestiae a ab repellendus natus.',
      price: 20000,
    });
    await camp.save();
  };
};

seedDB();