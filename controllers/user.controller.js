import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, email, password, role });
        await user.save();

        req.session.userId = user._id;

        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            message: "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log('User found:', user.username);

        const isMatch = await user.comparePassword(password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('Password did not match for user:', user.username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        user.lastLogin = new Date();
        await user.save();

        req.session.userId = user._id;

        console.log('Login successful for user:', user.username);
        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            message: "User logged in successfully"
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'User logged out successfully' });
    });
};
