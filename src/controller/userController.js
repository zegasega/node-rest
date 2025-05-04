import User from "../models/userModel.js";
import { validateUserInput,generateToken } from "../utils/utils.js";
import bcrypt from 'bcryptjs';




export const deleteUserByEmail = async (req,res) =>{

    try {
        const { email } = req.body;

        if (!email){
            return res.status(400).json({ message: 'Invalid Payload' });
        }

        const deletedUser = await User.findOne({ email });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User NOT FOUND' });
        }
        res.status(200).json({ message: 'User is Succesfully Deleted!', user: deletedUser });
        
    } catch (error) {
        
    }
}

export const createUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const { isValid, errors } = validateUserInput({ username, email, password });
      if (!isValid) {
        return res.status(400).json({ success: false, errors });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
  
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      const savedUser = await User.create({ username, email, password: hashedPassword });
  
      const token = generateToken(savedUser._id);
  
      res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User exists",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
