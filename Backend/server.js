require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes=require("./routes/authRoutes");
const dns=require("dns");

dns.setServers(["8.8.8.8"]);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
// app.use("/api/interview", require("./routes/interviewRoutes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);