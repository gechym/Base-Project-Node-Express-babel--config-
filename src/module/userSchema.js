import mongoose from 'mongoose';
import validator from 'validator';

import bcryptjs from 'bcryptjs';

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
        select: false,
    },
    passwordConfig: {
        type: String,
        required: [true, 'nhập lại pass nào'],
        validate: {
            validator: function (val) {
                return this.password === val;
            },

            message: 'Passconfig ko giống nhau',
        },
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcryptjs.hash(this.password, 12);
    this.passwordConfig = undefined;
});

userSchema.methods.checkPassword = async (passUserInput, passInDatabase) => {
    return await bcryptjs.compare(passUserInput, passInDatabase);
};

export default mongoose.model('user', userSchema);
