import express from 'express';
import {
    createTour,
    getTour,
    getTours,
    deleteTour,
    updateTour,
    checkBodyParser,
} from '../controller';
const tourRouter = express.Router();

tourRouter.route('/').get(getTours).post(checkBodyParser, createTour);
tourRouter.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

export default tourRouter;
