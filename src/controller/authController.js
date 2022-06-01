import jwt from 'jsonwebtoken';

import { User } from '../module';
import AppError from '../util/AppError';
import catchAsync from '../util/catchAsync';

export const signUp = catchAsync(async (req, res, next) => {
    const { name, password, email, passwordConfig } = req.body;
    if (!name || !email || !password || !passwordConfig) {
        return next(new AppError('Vui lòng cung cấp đầy đủ thông tin nha', 404));
    }

    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfig,
    });

    const token = jwt.sign(
        {
            id: newUser.id,
            name: newUser.name,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.TOKEN_JWT_HET_HAN,
        },
    );

    console.log(token);

    res.status(200).json({
        message: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});
