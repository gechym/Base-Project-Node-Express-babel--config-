require('dotenv').config({ path: './config.env' });
import express from 'express';
import morgan from 'morgan';
import AppError from './util/AppError';
import { tourRouter, userRouter } from './routes';
import handleError from './controller/HandleError';

const app = express();

//config
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.static(`${__dirname}/public`)); // khai các file

app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log('hello middleware 😘');
    req.requestTime = new Date().toISOString();
    next();
});

//Route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Global Error Handling Middleware
app.use('*', (req, res, next) => {
    const err = new AppError('Có cái nịt 😘😘😘', 404);
    next(err);
});

app.use(handleError());

export default app;
