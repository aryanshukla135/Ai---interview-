const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth",authRouter);
app.use("/api/interview",interviewRouter);

app.use((error, req, res, next) => {
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "Resume PDF must be 3MB or smaller" });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: "Only PDF resume files are supported" });
    }

    console.error("Unhandled server error:", error);
    return res.status(500).json({ message: "Something went wrong on the server" });
});

module.exports = app ;