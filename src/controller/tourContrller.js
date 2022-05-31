import { Tour } from '../module';
import APIfeature from '../util/APIfeature';
import catchAsync from '../util/catchAsync';

export const getTours = catchAsync(async (req, res, next) => {
    const { query, countData } = await APIfeature(req.query, Tour);
    const tours = await query;

    res.status(200).json({
        message: 'success',
        requestTime: req.requestTime,
        result: tours.length,
        count: countData,
        data: {
            tours: tours,
        },
    });
});
export const getTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const data = await Tour.findById(id);
    // const data = await Tour.findOne({ name: id });

    res.status(200).json({
        message: 'success',
        data: {
            tour: data,
        },
    });
});

export const createTour = catchAsync(async (req, res, next) => {
    console.log('1');
    const data = await Tour.create(req.body);
    res.status(200).json({
        message: 'success',
        requestTime: req.requestTime,
        data: {
            tour: data,
        },
    });
});

export const updateTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        message: 'success',
        data: {
            tour: data,
        },
    });
});

export const deleteTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
        message: 'success',
    });
});

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

export const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: null,
                numTours: { $sum: 1 }, // Tổng các fileds khí nó tổng hợp
                numRatings: { $sum: '$ratingsQuantity' }, // tổng
                avgRating: { $avg: '$ratingsAverage' }, // giá trị trung bình
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                tour: { $push: '$name' },
            },
        },
    ]);
    res.status(200).json({
        message: 'success',
        data: {
            stats: stats,
        },
    });
});

export const getTourMonthLyPlan = catchAsync(async (req, res, next) => {
    const year = req.query.year;
    const stats = await Tour.aggregate([
        {
            $unwind: '$startDates', // startDates là một mảng các ngày và sẽ được tách ra và các trường theo nó giống nhau
        },
        {
            $match: {
                // Chọn Theo điều kiện
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                    // $gte: new Date(`${year}-01-01`).toISOString(),
                    // $lte: new Date(`${year}-12-31`).toISOString(),
                },
            },
        },
        {
            $group: {
                _id: {
                    $month: {
                        $toDate: '$startDates',
                    },
                },
                numRatings: { $sum: '$ratingsQuantity' }, // tổng
                avgRating: { $avg: '$ratingsAverage' }, // giá trị trung bình
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                numTours: { $sum: 1 },
                day: {
                    $push: {
                        $dayOfMonth: {
                            $toDate: '$startDates',
                        },
                    },
                },
                tour: { $push: '$name' }, // $push đẩy vào một array
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: { _id: 0 }, // ẩn trường id
        },
        {
            $sort: {
                month: 1,
            },
        },
        // { được config bên middleware
        //     $match: {
        //         secretTour: {
        //             $ne: true,
        //         },
        //     },
        // },
    ]);

    res.status(200).json({
        message: 'success',
        data: {
            stats: stats,
        },
    });
});
