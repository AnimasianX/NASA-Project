const mongoose = require('mongoose');


const MONGO_URL = '{Your MongoDB}'

mongoose.connection.once('open', () => {
    console.log("connection ready");
})

mongoose.connection.on('error', (error) => {
    console.error(error);
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}