const axios = require('axios');
//const launches = new Map();
const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require("./planets.mongo");
//let latestFlightNumber = 100;

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';


// const launch = {
//     flightNumber: 100, //flight_number
//     mission: 'Kepler Exploration X', //name
//     rocket: 'Explorer IS1', // rocket.name in spacex api response
//     launchDate: new Date('December 27, 2030'), //date_local
//     target: 'Kepler-442 b', // not applicable
//     customers: ['ZTM', 'NASA'], //payload.customers for each payload
//     upcoming: true, //upcoming
//     success: true, //success
// };

// saveLaunch(launch);

//launches.set(launch.flightNo, launch);

async function getAllLaunches(skip, limit) {
    return await launchesDatabase
        .find({}, {
            '_id': 0,
            '__v': 0
        })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function saveLaunch(launch) {

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true
    })
}

async function getLatestFlightNumber() {

    const latestLaunch = await launchesDatabase.findOne()
        .sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return Number(latestLaunch.flightNumber);
}

async function scheduleNewLaunch(launch) {
    const planet = await planetsDatabase.findOne({ keplerName: launch.target });

    if (!planet) {
        throw new Error("No matching planet was found.");
    }


    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Master', 'NASA'],
        flightNumber: newFlightNumber
    });
    await saveLaunch(newLaunch);

}

// function addNewLaunch(launch) {
//     latestFlightNumber++;

//     // launches.set(
//     //     latestFlightNumber,
//     //     Object.assign(launch, {
//     //         success: true,
//     //         upcoming: true,
//     //         flightNo: latestFlightNumber,
//     //         customers: ['Zero to Master', 'NASA'],
//     //     })

//     // )
// }

async function existsLaunchWithId(launchId) {
    return await findLaunch({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({ flightNumber: launchId },
        {
            upcoming: false,
            success: false
        });
    return aborted.modifiedCount === 1;
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;

}

async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log("Problem downloading launch data");
        throw new Error("Launch data download failed.");

    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })
        console.log(launchDoc['date_local']);
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        }

        console.log(launch.flightNumber, launch.mission);
        await saveLaunch(launch);
    }


}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat"
    });

    if (firstLaunch) {
        console.log("Launch Data already loaded");

    } else {
        await populateLaunches();
    }

}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    loadLaunchData
};