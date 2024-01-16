const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to DB :)"))
    .catch((err) => {
        console.log("DB connection Failed :("),
        console.error(err),
        process.exit(1)
    })
}