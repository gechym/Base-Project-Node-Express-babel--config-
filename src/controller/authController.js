import jwt from 'jsonwebtoken';

import { User } from '../module';
import AppError from '../util/AppError';
import catchAsync from '../util/catchAsync';

const createToken = (newUser) => {
    return jwt.sign(
        {
            id: newUser.id,
            name: newUser.name,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.TOKEN_JWT_HET_HAN,
        },
    );
};

export const signUp = catchAsync(async (req, res, next) => {
    const { name, password, email, passwordConfig } = req.body;
    if (!name || !email || !password || !passwordConfig) {
        return next(new AppError('Vui lòng cung cấp đầy đủ thông tin nha', 404));
    }

    const newUser = await User.create({ name, email, password, passwordConfig });

    const token = createToken(newUser);

    console.log(token);

    res.status(200).json({
        message: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new AppError('Vui lòng cung cấp email và password', 404));

    const user = await User.findOne({ email: email }).select('+password');

    if (!user) return next(new AppError('User không tồn tại', 404));

    const checkPassword = await user.checkPassword(password, user.password);
    if (!checkPassword) return next(new AppError('pass không chính xác', 404));

    const token = createToken(user);

    res.status(200).json({
        message: 'success',
        token: token,
    });
});
