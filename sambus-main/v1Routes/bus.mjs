import express from 'express';
import { errorCodes } from '../core.mjs';
import { isValidObjectId } from 'mongoose';
import { userModel } from '../schema/userSchema.mjs';
import { busModel } from '../schema/busSchema.mjs';
import { passengerModel } from '../schema/passengerSchema.mjs';
import { routeModel } from '../schema/routeSchema.mjs'
import { datePattern } from '../schema/schemaConstants.mjs';
const router = express.Router();

router.get('/buses', async (req, res, next) => {
    try {
        const buses = await busModel.find({});
        res.status(200).send({
            data: buses,
            message: "SUCCESS",
            errorCode: errorCodes.SUCCESS,
        })
    } catch (error) {
        res.status(500).send({
            message: "UNKNOWN_SERVER_ERROR",
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
        })
    }
})

router.post('/bus-routes', async (req, res, next) => {
    try {
        const { origin, destination, date, passengers } = req?.body;

        if (!origin
            || !destination
            || !date
            || !passengers
        ){
            res.status(403).send({
                message: "REQUIRED_PARAMETER_MISSING",
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            })
            return;
        }
        if (!datePattern.test(req.body.date)) {
            res.status(403).send({
                message: `date pattern is not valid, date  must match this pattern: ${datePattern}`,
                errorCode: errorCodes.INVALID_DATE,
            });
            return;
        }
        const searchDate = new Date(date).toISOString().split('T')[0];
        const currentDate = new Date();

        const routes = await routeModel.find({
            $and: [
                { origin: origin },
                { destination: destination },
                // Match the date portion of departureTime
                // { departureTime: { $gte: new Date(searchDate)} },
                // { departureTime: { $gte: currentDate } },
                { availableSeats: { $gte: passengers }},
                { isActive: true }
            ]
        }).sort({ departureTime: 1 });
        res.status(200).send({
            data: routes,
            message: "available routes",
            errorCode: errorCodes.SUCCESS,
        })
    } catch (error) {
        res.status(500).send({
            message: "UNKNOWN_SERVER_ERROR",
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.get('/seats/:routeId', async (req, res, next) => {
    try {
        const routeId = req?.params.routeId;
        if (!routeId) {
            return res.status(403).send({
                message: "REQUIRED_PARAMETER_MISSING",
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING
            });
        }

        if (!isValidObjectId(routeId)) {
            return res.status(403).send({
                errorCode: errorCodes.INVALID_ROUTE_ID,
                message: 'INVALID_ROUTE_ID',
            });
        }

        const bookedSeats = await passengerModel.find({ route: routeId }).select('seatNumber');

        // Extracting seat numbers from booked seats
        const bookedSeatNumbers = bookedSeats.map(passenger => passenger.seatNumber);

        // Assuming totalSeats is fetched from the route object in the database
        const route = await routeModel.findById(routeId);
        const totalSeats = route.totalSeats;

        // Generating an array of available seats
        const availableSeats = Array.from({ length: totalSeats }, (_, index) => index + 1)
                                  .filter(seat => !bookedSeatNumbers.includes(seat));

        res.status(200).send({
            availableSeats: availableSeats,
            totalSeats,
            message: " Available Seats",
            errorCode: errorCodes.SUCCESS,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "UNKNOWN_SERVER_ERROR",
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        });
    }
});

export default router;
