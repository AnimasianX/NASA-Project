const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');
const server = http.createServer(app);//express is basically a fancy listener function so any middleware, routes we add to it will essentially do the same thing. 
//the added benefit of this is that now, we can separate our code and make it more modular and organized.
const { loadPlanetsData } = require('./models/planets.model');
const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://admin-jimmy:Test123@cluster0.htius.mongodb.net/nasa?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log("connection ready");
})

mongoose.connection.on('error', (error) => {
    console.error(error);
})

async function startServer() {
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log("Listening on port: ", PORT);
    });
}

startServer();