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

export const ruleAccect =
    (...rules) =>
    (req, res, next) => {
        if (!rules.includes(req.user.rule)) {
            return next(
                new AppError('Bạn ko có quyền truy cập tài nguyên này', 404),
            );
        }

        next();
    };

export const protect = catchAsync(async (req, res, next) => {
    // lấy token
    const { authorization } = req.headers;
    let token;

    //https://anonystick.com/blog-developer/bearer-token-la-gi-neu-khong-co-bearer-truoc-token-2021052140045637#:~:text=Theo%20c%C3%A1c%20t%C3%A0i%20li%E1%BB%87u%20th%C3%AC,lu%C3%B4n%20mang%20theo%20token%20n%C3%A0y.
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
    const currentUser = await User.findById(decode.id);
    if (!currentUser) {
        return next(
            new AppError('Lỗi xác thực danh tính ,Vui lòng đăng nhập lại', 404),
        );
    }

    // check đổi pass khi token còn hạn => bắt user login lại

    if (currentUser.changedPasswordAfter(decode.iat * 1000))
        return next(
            new AppError(
                `Bạn mới đổi mật khẩu ngày ${currentUser.passwordChangeAt.toLocaleString()} vui lòng đăng nhập lại`,
                404,
            ),
        );

    // đẩy user lên req để sử dụng cho các router khác hoặc trả về clier
    req.user = currentUser;

    next();
});

export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) return next(new AppError('Vui lòng cung cấp email'));
    const user = await User.findOne({ email });

    if (!user) return next(new AppError('Không tồn tại người dùng'));
    const tokenReset = user.createPasswordresetToken();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        message: 'success',
        data: {
            tokenReset: tokenReset,
        },
    });
});

export const resetPassword = catchAsync(async (req, res, next) => {
    next();
});
