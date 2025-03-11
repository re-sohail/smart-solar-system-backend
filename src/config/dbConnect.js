const mongoose = require("mongoose");
const logger = require("./logger");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

const dbConnect = async () => {
  try {
    const Options = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    await mongoose.connect(MONGO_URI, Options);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

// Setup Mongoose Connection Event Listeners
// These listeners log important events to help with debugging and monitoring:
//  - 'connected': Successful connection.
//  - 'error': Connection errors.
//  - 'disconnected': When the connection is lost.

mongoose.connection.on("connected", () => {
  logger.info("Mongoose connection established successfully.");
});

mongoose.connection.on("error", (error) => {
  logger.error("Mongoose connection error: %s", error);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("Mongoose connection has been disconnected..");
});

// Close the Mongoose connection when the Node process is terminated.
// This is important to ensure that the connection is properly closed

// is ko is waja sy comment kr dia q kah server.js main is ko use kia hai
// process.on("SIGINT", async () => {
//   try {
//     await mongoose.connection.close();
//     logger.info(
//       "Mongoose connection is disconnected due to application termination"
//     );
//     process.exit(0);
//   } catch (error) {
//     logger.error("Error while closing Mongoose connection", error);
//     process.exit(1);
//   }
// });

module.exports = dbConnect;
