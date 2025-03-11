const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const routes = require("./routes/index");
const errorHandler = require("./api/middleware/errorHandler");
const successHandler = require("./api/middleware/successHandler");
const logger = require("./config/logger");
require("dotenv").config();

// Morgan Logger
app.use(
  morgan(process.env.NODE_ENV == "production" ? "combined" : "dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Security
app.use(helmet());

// Enable CORS
app.use(cors());

// Compress responses
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error Handler Middleware
app.use(errorHandler);

// Success Handler Middleware
app.use(successHandler);

// Api Routes
app.use("/api/v1", routes);

module.exports = app;
