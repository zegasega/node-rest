import express from 'express';
import { createUser, deleteUserByEmail, findUserByEmail, loginUser } from '../controller/userController.js';
import { auth, authorize } from '../middleware/auth.js';

const userRouter = express.Router();

// Kayıt için kullanıcı oluşturma
userRouter.post('/register', createUser);

// Giriş işlemi
userRouter.post('/login', loginUser);

// Email ile kullanıcı arama
userRouter.post('/email', findUserByEmail);

// Email ile kullanıcı silme, sadece admin yetkisine sahip kullanıcılar erişebilir
userRouter.delete('/email', auth, authorize(['admin']), deleteUserByEmail);

export default userRouter;
