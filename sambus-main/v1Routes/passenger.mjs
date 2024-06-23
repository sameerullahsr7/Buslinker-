import express from 'express';
import { errorCodes } from '../core.mjs';

import { isValidObjectId } from 'mongoose';
import { passengerModel } from '../schema/passengerSchema.mjs';
import { phonePattern } from '../schema/schemaConstants.mjs';
import { routeModel } from '../schema/routeSchema.mjs';
import { userModel } from '../schema/userSchema.mjs';

const router = express.Router();

router.post('/passenger/:routeId', async (req, res, next) => {
    try {
        const routeId = req.params.routeId;
        const userId = req.user._id;
        const { firstName, lastName, age, phone, seatNumber } = req.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        const busRoute = await routeModel.findOne({ _id: routeId });

        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }
        if (!busRoute) {
            res.status(404).send({
                message: "Bus Route Not Exist",
                errorCode: errorCodes.BUS_ROUTE_NOT_EXIST,
            })
            return;
        }

        if ( !firstName
            || !lastName
            || !age
            || !phone
            || !seatNumber
            || !isValidObjectId(routeId)
        ) {
            res.status(403).send({
                message: 'REQUIRED_PARAMETER_MISSING',
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING
            });
            return;
        }
        if (!phonePattern.test(phone)) {
            res.status(403).send({
                message: 'phone number is not valid',
                errorCode: errorCodes.INVALID_PHONE_NUMBER,
            });
            return;
        }
        const seatBooked = await passengerModel.findOne({ seatNumber: seatNumber, route: routeId}).lean();
        if (seatBooked) {
            res.status(403).send({
                message: 'seat already choose different seat Number',
                errorCode: errorCodes.SEAT_ALREADY_BOOKED
            });
            return;
        }
        const passenger = await passengerModel.create({
            seatNumber: seatNumber,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            age: age,
            route: routeId,
            bookedBy: userId
        });
        busRoute.availableSeats -= 1;
        busRoute.save();
        res.status(200).send({
            message: 'Passenger Created successful',
            passengerId: passenger._id,
            errorCode: errorCodes.SUCCESS,
        });
    } catch (error) {
        res.send(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.get('/bus-route/:routeId/passengers', async (req, res, next) => {
    try {
        const routeId = req.params.routeId;
        if (!routeId || !isValidObjectId(routeId)) {
            res.status(403).send({
                message: 'REQUIRED_PARAMETER_MISSING',
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING
            })
            return;
        }
        const passengers = await passengerModel.find({ route: routeId}).lean();
        res.status(200).send({
            message: 'Passengers fetched successfully',
            data: passengers,
            errorCode: errorCodes.SUCCESS
        })
    } catch (error) {
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.get('/user-reservations', async (req, res, next) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            res.status(401).send({
                message: 'UNAUTHORIZED',
                errorCode: errorCodes.UNAUTHORIZED
            })
            return;
        }
        const reservations = await passengerModel.find({ bookedBy: userId }).populate('route').lean();
        res.status(200).send({
            message: 'Passengers fetched successfully',
            data: reservations,
            errorCode: errorCodes.SUCCESS
        })
    } catch (error) {
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

router.delete('/user-reservation/:passengerId', async (req, res) => {
    try {
        const passengerId = req.params.passengerId;
        const userId = req.user._id;
        const user = await userModel.findOne({ _id: userId }).lean();

        if (!user) {
            res.status(401).send({
                message: "UNAUTHORIZED",
                errorCode: errorCodes.UNAUTHORIZED,
            })
            return;
        }
        if (!passengerId || !isValidObjectId(passengerId)) {
            res.status(403).semd({
                message: 'REQUIRED_PARAMETER_MISSING or invalid passengerId',
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING
            })
            return;
        }
        const passenger = await passengerModel.findOne({ _id: passengerId, bookedBy: userId })
        if (!passenger) {
            res.status(404).send({
                message: 'Passenger Not Found',
                errorCode: errorCodes.PASSENGER_NOT_FOUND
            })
            return;
        }
        if (passenger.isPaid === true) {
            res.status(400).send({
                message: 'Cannot cancel paid reservation',
                errorCode: errorCodes.CANNOT_CANCEL_PAID_RESERVATION
            })
            return;
        }
        await passengerModel.findByIdAndDelete(passengerId);
        res.status(200).send({
            message: 'Passenger deleted successfully',
            errorCode: errorCodes.SUCCESS
        })
    } catch (error) {
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error.message}`,
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR
        })
    }
})

export default router;