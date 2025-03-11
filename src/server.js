// const app = require("./app");
// const mongoose = require("mongoose");
// const dbConnect = require("./config/dbConnect");
// const logger = require("./config/logger");
// require("dotenv").config();

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     await dbConnect();

//     const server = app.listen(PORT, () => {
//       logger.info(`Server is running on port ${PORT}`);
//     });

//     const handleShutdown = async (signal) => {
//       logger.info(`Received ${signal}. Closing server gracefully.`);
//       server.close(async () => {
//         await mongoose.disconnect();
//         logger.info("Server closed.");
//         process.exit(0);
//       });
//     };

//     process.on("SIGINT", handleShutdown);
//     process.on("SIGTERM", handleShutdown);

//     // Uncomment the following lines to test the shutdown process
//     // setTimeout(() => {
//     //   process.emit("SIGTERM");
//     // }, 10000);
//   } catch (error) {
//     logger.error("Server startup failed:", error);
//     process.exit(1);
//   }
// };

// startServer();

const app = require("./app");
const mongoose = require("mongoose");
const dbConnect = require("./config/dbConnect");
const logger = require("./config/logger");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await dbConnect();

    // Only start the server if not deployed in a serverless environment
    if (!process.env.VERCEL) {
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
    }
  } catch (error) {
    logger.error("Server startup failed:", error);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  // Only start the server locally
  startServer();
} else {
  // When on Vercel, export the app so that the serverless function can handle the requests
  module.exports = app;
}
