const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const db = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload"); 

// connect DB
db.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    'http://localhost:3000',
    'https://skill-space-kaeeexjzd-raghavs-projects-0b174d42.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Include cookies if needed
}));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

// connect to Cloudinary
cloudinaryConnect();

//mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

// testing route
app.get("/test", (req, res) => {
    console.log("hello doston")
    return res.json({
        success: true,
        message: "test route working hui hui"
    })
})

// default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is running..."
    })
})


// activate server
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})