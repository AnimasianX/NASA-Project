//Treat our model like a class in C++/Java etc. 
//we have our accessors and mutators and other functions we may need. Our controllers are used to fetch this data so being more abstract in the controller layer 
//makes our code more easier to read
const { parse } = require('csv-parse');
const path = require('path');
const fs = require('fs');

const planets = require('./planets.mongo');
const habitablePlanets = [];

function isHabitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => fs.createReadStream(path.join(__dirname, "../..", "data", "kepler_data.csv"))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitable(data)) {
                savePlanetToMongo(data);
            }
        })
        .on('error', (error) => {
            console.log(error);
            reject(error);
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length;
            console.log(countPlanetsFound, "habitable Planets found!");
            resolve();
        }))
}

async function getAllPlanets() {
    return await planets.find({}, { '__v': 0, '_id': 0 });
}

async function savePlanetToMongo(planet) {
    //habitablePlanets.push(data);
    //TODO: replace with upsert so that we do not duplicate insert data to mongo
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true
        })
    } catch (error) {
        console.log("Could not save planets data to Mongo " + error);
    }
}


module.exports = {
    loadPlanetsData,
    getAllPlanets,
}