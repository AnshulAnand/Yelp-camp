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
          url: 'https://res.cloudinary.com/ddjauevre/image/upload/v1670929894/YelpCamp/tegan-mierle-fDostElVhN8-unsplash_lhygqk.jpg',
          filename: 'YelpCamp/tegan-mierle-fDostElVhN8-unsplash_lhygqk',
        },
        {
          url: 'https://res.cloudinary.com/ddjauevre/image/upload/v1670929901/YelpCamp/chris-holder-uY2UIyO5o5c-unsplash_idzdjc.jpg',
          filename: 'YelpCamp/chris-holder-uY2UIyO5o5c-unsplash_idzdjc',
        },
        {
          url: 'https://res.cloudinary.com/ddjauevre/image/upload/v1670929909/YelpCamp/jimmy-conover-J_XuXX9m0KM-unsplash_e5ab2t.jpg',
          filename: 'YelpCamp/jimmy-conover-J_XuXX9m0KM-unsplash_e5ab2t',
        },
        {
          url: 'https://res.cloudinary.com/ddjauevre/image/upload/v1670929915/YelpCamp/hugues-de-buyer-mimeure-hGuGRayJrv0-unsplash_bbgpyn.jpg',
          filename: 'YelpCamp/hugues-de-buyer-mimeure-hGuGRayJrv0-unsplash_bbgpyn',
        },
      ],
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta ea veritatis est unde eum ipsa molestiae a ab repellendus natus.',
      price: 20000,
    });
    await camp.save();
  };
};

seedDB();