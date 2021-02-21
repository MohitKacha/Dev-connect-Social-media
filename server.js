const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Database Connection
connectDB();

//Init middleware - parsing body
app.use(express.json({ extended: false }));

//Define Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
