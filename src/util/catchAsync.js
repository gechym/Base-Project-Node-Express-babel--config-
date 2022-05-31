import AppError from './AppError';

const catchAsync = (callBackFn) => {
    return async (req, res, next) => {
        try {
            await callBackFn(req, res, next);
        } catch (error) {
            const errorRes = new AppError(error.message, 404);
            next(errorRes);
        }
    };
};

export default catchAsync;
