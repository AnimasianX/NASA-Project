const request = require('supertest');
const app = require('../../app');
describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    })
})

describe('Test POST /launches', () => {
    const completeLaunchData =
    {
        mission: 'USS Enterprise',
        rocket: 'NCC 170',
        target: "Kepler 172 f",
        launchDate: 'January 4, 2028'
    }

    const launchDateWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 170',
        target: "Kepler 172 f",
    }

    const launchDateWithBadDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 170',
        target: "Kepler 172 f",
        launchDate: 'hello'
    }

    test('It should respond with 201 created', async () => {

        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDateWithoutDate);

    })

    test("It should catch missing required properties", async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDateWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'missing required launch property',
        });
    })

    test("It should catch invalid dates", async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDateWithBadDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'invalid launch date',
        });
    })
})