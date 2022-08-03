const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log("connection ready");
})

mongoose.connection.on('error', (error) => {
    console.error(error);
})

async function mongoConnect() {
    console.log(process.env.MONGO_URL);
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}