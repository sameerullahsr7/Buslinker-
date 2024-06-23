import express from 'express';
import Stripe from 'stripe';
import { errorCodes } from '../core.mjs';
import { passengerModel } from '../schema/passengerSchema.mjs';

const stripe = new Stripe('abc123');
const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
    try {
      const { passengersIds } = req.body;
      const passengers = await passengerModel.find({ _id: { $in: passengersIds } });

      if (!passengers || passengers.length === 0) {
        res.status(404).send({
          message: 'Passengers not found',
          errorCode: errorCodes.PASSSENGER_NOT_FOUND
        });
        return;
      }

      const amount = passengers.reduce((sum, passenger) => sum + passenger.price, 0);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Amount is in cents
        currency: 'pkr',
        payment_method_types: ['card'],
      });

      res.status(200).send({
        message: 'SUCCESS',
        clientSecret: paymentIntent.client_secret,
        errorCode: errorCodes.SUCCESS
      });
  } catch (err) {
    res.status(500).send({
        message: `UNKNOWN SERVER ERROR: ${err.message}`,
        errorCode: errorCodes.UNKNOWN_SERVER_ERROR
    })
  }
});

router.post('/update-passengers', async (req, res) => {
    
    try {
      const { passengersIds } = req.body;
      const userId = req.user._id;
      const user = await userModel.findOne({ _id: userId }).lean();

      if (!user) {
         res.status(401).send({
            message: "UNAUTHORIZED",
            errorCode: errorCodes.UNAUTHORIZED,
        })
        return;
      }
      await passengerModel.updateMany(
        { _id: { $in: passengersIds } },
        { $set: { isPaid: true } }
      );
  
      res.status(200).send({ 
        message: 'Passenger payment completed successfully',
        errorCode: errorCodes.SUCCESS
      });
    } catch (error) {
      res.status(500).send({
        message:`UNKNOWN_SERVER_ERROR: ${error.message}`,
        errorCode: errorCodes.UNKNOWN_SERVER_ERROR
      });
    }
  });

export default router;