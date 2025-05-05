import User from "../models/userModel.js";
import { validateUserInput, generateToken } from "../utils/utils.js";
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';
import { AppError } from '../middleware/errorHandler.js';

class UserController {
  /**
   * @desc    Get all users
   * @route   GET /api/users
   * @access  Private/Admin
   */
  getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    
    return ApiResponse.success(res, {
      users,
      count: users.length
    });
  });

  /**
   * @desc    Delete user by email
   * @route   DELETE /api/users/email
   * @access  Private/Admin
   */
  deleteUserByEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      throw new AppError('User not found', 404);
    }

    return ApiResponse.success(res, { user: deletedUser }, 'User successfully deleted');
  });

  /**
   * @desc    Create new user
   * @route   POST /api/users/register
   * @access  Public
   */
  createUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    const { isValid, errors } = validateUserInput({ username, email, password });
    if (!isValid) {
      throw new AppError('Invalid input', 400, errors);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    const token = generateToken(user._id);

    return ApiResponse.created(res, {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });

  /**
   * @desc    Login user
   * @route   POST /api/users/login
   * @access  Public
   */
  loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    return ApiResponse.success(res, {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });

  /**
   * @desc    Find user by email
   * @route   POST /api/users/email
   * @access  Private
   */
  findUserByEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return ApiResponse.success(res, {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });

  /**
   * @desc    Update user
   * @route   PUT /api/users/:id
   * @access  Private
   */
  updateUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update only provided fields
    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 12);
    if (role) user.role = role;

    const updatedUser = await user.save();

    return ApiResponse.success(res, {
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    }, 'User updated successfully');
  });
}

export default new UserController();
