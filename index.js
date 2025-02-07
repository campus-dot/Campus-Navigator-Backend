import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import User from "./models/User.js";
import { protect, isAppAdmin } from "./middleware/authMiddleware.js";
import router from "./routes/route.js";

dotenv.config();

const app = express();

const corsOptions = {
    credentials: true,
    origin: process.env.FRONTEND_URL,
};

app.use(cors(corsOptions));  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false, 
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

app.use("/api/auth", authRoutes);
app.use("/api", router);

const createFirstAdmin = async () => {
    const firstAdmin = await User.findOne({ role: 'appAdmin' });
    if (!firstAdmin) {
        const newUser = new User({
            username: 'firstAdmin',
            password: 'firstAdmin123',
            role: 'appAdmin',
        });
        await newUser.save();
        console.log("First admin created!");
    }
};

createFirstAdmin();

app.get('/', (req, res) => {
    res.json({ message: "Server is running" });
});

app.get('/admin-dashboard', protect, isAppAdmin, (req, res) => {
    res.send('Welcome to the Admin Dashboard');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const port = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(port, () => {
        console.log("🚀 Server is running in port" , port);
    });
}).catch(err => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
});
