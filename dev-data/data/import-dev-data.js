const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const Tour = require('../../Module/tourModule');
const User = require('../../Module/userModule');
const Review = require('../../Module/reviewModule');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);
console.log(tours);

const DB =
    'mongodb+srv://baodb:7TBVz7dP6ZeRNexQ@cluster0.z4hlq.mongodb.net/natour?retryWrites=true&w=majority';
const DATABASE_LOCAL = 'DATABASE_LOCAL=mongodb://127.0.0.1:27017/natour';
// mongoose.connect(DATABASE_LOCAL,{ // Connect db local host
mongoose
    .connect(DB, {
        // v6 not suppot affter config so we use v5.5.2
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => console.log('DB connection successful !'));

const importTour = async () => {
    try {
        await Tour.create(tours);
        // await User.create(users, {validateBeforeSave : false})
        // await Review.create(reviews)
        console.log('data import succsess');
    } catch (error) {
        console.log(error);
    }
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        // await User.deleteMany()
        // await Review.deleteMany()
        console.log('delete succsess');
    } catch (error) {
        console.log(error);
    }
};

if (process.argv[2] === '--import') {
    importTour();
}
if (process.argv[2] === '--delete') {
    deleteData();
}
