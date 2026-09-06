const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const dns = require("dns")

dns.setServers(['1.1.1.1','8.8.8.8'])
// load env variables
dotenv.config();

// connect database
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/workspace", require("./routes/workspace"));
app.use("/api/boards", require("./routes/board"));
app.use("/api/lists", require("./routes/list"));
app.use("/api/cards", require("./routes/card"));
app.use("/api/search", require("./routes/search"));
// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
