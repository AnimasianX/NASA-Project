const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');

const { mongoConnect } = require('./services/mongo');

const server = http.createServer(app);//express is basically a fancy listener function so any middleware, routes we add to it will essentially do the same thing. 
//the added benefit of this is that now, we can separate our code and make it more modular and organized.
const { loadPlanetsData } = require('./models/planets.model');
const PORT = process.env.PORT || 8000;




async function startServer() {
    await mongoConnect();
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log("Listening on port: ", PORT);
    });
}

startServer();