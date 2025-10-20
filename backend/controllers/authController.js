import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const registerUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password, phone, role });
        if (user) {
            generateToken(res, user._id);
            // CRITICAL FIX: We now send the response with the user object nested under a 'user' key.
            res.status(201).json({
                user: { _id: user._id, name: user.name, email: user.email, role: user.role }
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            // CRITICAL FIX: The response is now nested to match what the frontend expects.
            res.status(200).json({
                user: { _id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

const getUserProfile = (req, res) => {
    if (req.user) {
        // CRITICAL FIX: The profile route is also nested for consistency.
        res.json({
            user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
};

