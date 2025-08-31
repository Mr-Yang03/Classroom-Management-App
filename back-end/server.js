const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { db } = require("./config/db");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./swagger-output.json');

const loginRoute = require("./routes/loginRoute");

dotenv.config();

const app = express();

app.use(cors());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/instructor", loginRoute);

const PORT = process.env.PORT || 8000;

// Error handlers
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Server đang bị lỗi. Vui lòng thử lại sau!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} ...`);
});