import express from 'express';
import {
    createTour,
    getTour,
    getTours,
    deleteTour,
    updateTour,
    checkBodyPaser,
} from '../controller';
const tourRouter = express.Router();

tourRouter.route('/').get(getTours).post(checkBodyPaser, createTour);
tourRouter.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

export default tourRouter;
