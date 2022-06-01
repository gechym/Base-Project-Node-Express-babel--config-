import express from 'express';
import {
    checkIdUser,
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
    signUp,
    login,
    forgotPassword,
    resetPassword,
} from '../controller';

const userRouter = express.Router(signUp);

userRouter.param('id', checkIdUser);

userRouter.route('/signup').post(signUp);
userRouter.route('/login').post(login);
userRouter.route('/forgot-password').post(forgotPassword);
userRouter.route('/reset-password').post(resetPassword);

userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/:id').get(getUser).delete(deleteUser).put(updateUser);

export default userRouter;
