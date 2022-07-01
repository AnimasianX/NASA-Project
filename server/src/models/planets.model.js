//Treat our model like a class in C++/Java etc. 
//we have our accessors and mutators and other functions we may need. Our controllers are used to fetch this data so being more abstract in the controller layer 
//makes our code more easier to read
const { parse } = require('csv-parse');
const path = require('path');
const fs = require('fs');

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
        .on('data', (data) => {
            if (isHabitable(data)) {
                habitablePlanets.push(data);
            }
        })
        .on('error', (error) => {
            console.log(error);
            reject(error);
        })
        .on('end', () => {
            console.log(habitablePlanets.length, "habitable Planets found!");
            resolve();
        }))
}

function getAllPlanets() {
    return habitablePlanets;
}


module.exports = {
    loadPlanetsData,
    getAllPlanets,
}