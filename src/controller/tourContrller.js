import { Tour } from '../module';

export const getTours = async (req, res) => {
    try {
        const tours = await Tour.find();

        res.status(200).json({
            message: 'success',
            requestTime: req.requestTime,
            data: {
                tours: tours,
            },
        });
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
};
export const getTour = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const data = await Tour.findById(id);
        // const data = await Tour.findOne({ name: id });

        res.status(200).json({
            message: 'success',
            data: {
                tour: data,
            },
        });
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
};

export const createTour = async (req, res) => {
    try {
        const data = await Tour.create(req.body);
        res.status(200).json({
            message: 'success',
            requestTime: req.requestTime,
            data: {
                tour: data,
            },
        });
    } catch (error) {
        console.log(error.message);
        res.status(404).json({
            message: error.message,
        });
    }
};

export const updateTour = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        // const data = await Tour.findOne({ name: id });

        res.status(200).json({
            message: 'success',
            data: {
                tour: data,
            },
        });
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
};

export const deleteTour = async (req, res) => {
    const { id } = req.params;

    try {
        await Tour.findByIdAndDelete(id);
        res.status(200).json({
            message: 'success',
        });
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
};

// middleware
export const checkBodyParser = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(404).json({
            message: 'missing data name and price',
        });
    }

    next();
};
