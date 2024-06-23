import cron from 'node-cron';
// Assuming this is the path to your route model
import { routeModel } from './schema/routeSchema.mjs';

cron.schedule('0 * * * *', async () => {
    try {
        const currentDate = new Date();
        await routeModel.updateMany(
            { departureTime: { $lt: currentDate } },
            { $set: { isActive: false } }
        );
        console.log('Routes updated successfully.');
    } catch (error) {
        console.error('Error updating routes:', error);
    }
});
