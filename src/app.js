require('dotenv').config({ path: './config.env' });
import express from 'express';
const app = express();

//config
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.static(`${__dirname}/public`)); // khai các file

const getTours = (req, res) => {
    res.status(200).json({
        message: 'success',
        data: [
            {
                id: 0,
                name: 'The Forest Hiker',
            },
        ],
    });
};
const getTour = (req, res) => {
    console.log(req.body);
    res.status(200).json({ ...req.body, id: req.params.id });
};

const createTour = (req, res) => {
    res.status(200).json({
        message: 'success',
        data: {
            tours: req.body,
        },
    });
};

const updateTour = (req, res) => {
    const { id } = req.params;

    res.status(200).json({
        message: 'update success',
        data: {
            id,
            ...req.body,
        },
    });
};

app.route('/api/v1/tours').get(getTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).put(updateTour);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});

export default app;
