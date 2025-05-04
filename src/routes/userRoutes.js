import express from 'express';
import { createUser, deleteUserByEmail, findUserByEmail, loginUser } from '../controller/userController.js';
import { auth, authorize } from '../middleware/auth.js';

const userRouter = express.Router();


userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/email', findUserByEmail);


userRouter.delete('/email', auth, authorize(['admin']), deleteUserByEmail);

export default userRouter;
