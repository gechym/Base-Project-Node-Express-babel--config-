import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'cho xin cái tên pro'],
        minLength: [10, 'tối thiểu 10 chữ nha'],
    },
    email: {
        type: String,
        required: [true, 'có cái email cx ko điền làm ăn gì?'],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'không phải email chế ơi'],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'ê xin cái pass'],
        minLength: 8,
    },
    passwordConfig: {
        type: String,
        required: [true, 'nhập lại pass nào'],
    },
});

export default mongoose.model('user', userSchema);
