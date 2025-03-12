const app = require("./app");
const mongoose = require("mongoose");
const dbConnect = require("./config/dbConnect");
const logger = require("./config/logger");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await dbConnect();

    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    const handleShutdown = async (signal) => {
      logger.info(`Received ${signal}. Closing server gracefully.`);
      server.close(async () => {
        await mongoose.disconnect();
        logger.info("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);

    // Uncomment the following lines to test the shutdown process
    // setTimeout(() => {
    //   process.emit("SIGTERM");
    // }, 10000);
  } catch (error) {
    logger.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
