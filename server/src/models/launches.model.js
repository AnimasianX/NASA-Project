const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNo: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};


launches.set(launch.flightNo, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            success: true,
            upcoming: true,
            flightNo: latestFlightNumber,
            customers: ['Zero to Master', 'NASA'],
        })

    )
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
};