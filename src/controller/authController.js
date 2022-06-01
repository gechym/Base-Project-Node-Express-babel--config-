import { Console } from 'console';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

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
    const { name, password, email, passwordConfig, passwordChangeAt } =
        req.body;
    if (!name || !email || !password || !passwordConfig) {
        return next(
            new AppError('Vui lòng cung cấp đầy đủ thông tin nha', 404),
        );
    }

    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfig,
        passwordChangeAt,
    });

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

    const user = await User.findOne({
        email: email,
    }).select('+password');

    if (!user) return next(new AppError('User không tồn tại', 404));

    const checkPassword = await user.checkPassword(password, user.password);
    if (!checkPassword) return next(new AppError('pass không chính xác', 404));

    const token = createToken(user);

    res.status(200).json({
        message: 'success',
        token: token,
    });
});

export const protect = catchAsync(async (req, res, next) => {
    // lấy token
    const { authorization } = req.headers;
    let token;

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    if (!token) return next(new AppError('Bạn chưa đăng nhập', 404));

    // verify token
    let decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    decode = {
        ...decode,
        decode_iat: new Date(decode.iat * 1000).toLocaleString(),
        decode_exp: new Date(decode.exp * 1000).toLocaleString(),
    };
    console.log(decode);

    // check user
    const user = await User.findById(decode.id);
    if (!user) {
        return next(
            new AppError('Lỗi xác thực danh tính ,Vui lòng đăng nhập lại', 404),
        );
    }

    // check đổi pass khi token còn hạn => bắt user login lại

    if (user.changedPasswordAfter(decode.iat * 1000))
        return next(
            new AppError(
                `Bạn mới đổi mật khẩu ngày ${user.passwordChangeAt.toLocaleString()} vui lòng đăng nhập lại`,
                404,
            ),
        );

    // đẩy user lên req để sử dụng cho các router khác hoặc trả về clier
    req.user = user;

    next();
});
