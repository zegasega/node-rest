import express from 'express';
import UserController from '../controller/userController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser);

// Protected routes
router.use(auth); // Apply authentication middleware to all routes below

router.route('/email')
  .post(UserController.findUserByEmail)
  .delete(authorize(['admin']), UserController.deleteUserByEmail);

router.route('/profile')
  .put(UserController.updateUser);

router.get('/users', authorize(['admin']), UserController.getAllUsers);

export default router;
