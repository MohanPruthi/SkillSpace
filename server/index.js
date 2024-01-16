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
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,

    })
)
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

// connect to Cloudinary
cloudinaryConnect();

//mount routes
app.use("api/v1/auth", userRoutes);
app.use("api/v1/profile", profileRoutes);
app.use("api/v1/payment", paymentRoutes);
app.use("api/v1/course", courseRoutes);

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