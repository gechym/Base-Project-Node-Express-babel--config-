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
    protect,
    updatePassword,
} from '../controller';

const userRouter = express.Router(signUp);

userRouter.param('id', checkIdUser);

userRouter.route('/signup').post(signUp);
userRouter.route('/login').post(login);
userRouter.route('/forgot-password').post(forgotPassword);
userRouter.route('/reset-password/:token').patch(resetPassword);
userRouter.route('/change-password').patch(protect, updatePassword);

userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/:id').get(getUser).delete(deleteUser).put(updateUser);

export default userRouter;
