//const launches = new Map();
const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require("./planets.mongo");
//let latestFlightNumber = 100;

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

//launches.set(launch.flightNo, launch);

async function getAllLaunches() {
    return await launchesDatabase.find({}, {
        '_id': 0,
        '__v': 0
    });
}

async function saveLaunch(launch) {
    const planet = await planetsDatabase.findOne({ keplerName: launch.target });

    if (!planet) {
        throw new Error("No matching planet was found.");
    }

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
    return await launchesDatabase.findOne({ flightNumber: launchId })
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

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
};