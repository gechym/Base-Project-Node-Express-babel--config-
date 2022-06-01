import { User } from '../module';
import AppError from '../util/AppError';
import catchAsync from '../util/catchAsync';

export const signUp = catchAsync(async (req, res, next) => {
    const { name, password, email, passwordConfig } = req.body;
    if (!name || !email || !password || !passwordConfig) {
        return next(new AppError('Vui lòng cung cấp đầy đủ thông tin nha', 404));
    }

    const newUser = await sUser.create({
        name,
        email,
        password,
        passwordConfig,
    });

    res.status(200).json({
        message: 'success',
        data: {
            user: newUser,
        },
    });
});
