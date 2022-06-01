import express from 'express';
import {
    checkIdUser,
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
    signUp,
} from '../controller';

const userRouter = express.Router(signUp);

userRouter.param('id', checkIdUser);

userRouter.route('/signup').post(signUp);

userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/:id').get(getUser).delete(deleteUser).put(updateUser);

export default userRouter;
