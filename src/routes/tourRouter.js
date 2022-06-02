import express from 'express';
import {
    createTour,
    getTour,
    getTours,
    deleteTour,
    updateTour,
    checkBodyParser,
    getTourStats,
    getTourMonthLyPlan,
    protect,
    ruleAccect,
} from '../controller';
const tourRouter = express.Router();

tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/tour-monthly-plan').get(getTourMonthLyPlan);

tourRouter.route('/').get(protect, ruleAccect('user', 'admin'), getTours).post(checkBodyParser, createTour);
tourRouter.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

export default tourRouter;
