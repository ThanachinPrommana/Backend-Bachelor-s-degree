
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const { readdirSync } = require("fs");
require("dotenv").config();
const session = require("express-session");

const { startNotificationSchedulers } = require("./Scheduler/notificationScheduler")
app.use(morgan("dev"));


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));


app.use(express.json());


app.use(session({
    secret: process.env.SECRETKEY || "SECRETKEY",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        domain: 'localhost'
    }
}));


app.use((req, res, next) => {
    console.log("Request to:", req.path);
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
    next();
});


readdirSync("./routers").map((c) => app.use("/api", require("./routers/" + c)));



const PORT = 8200;
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
    startNotificationSchedulers();
});