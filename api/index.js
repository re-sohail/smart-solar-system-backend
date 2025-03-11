// api/index.js
const serverless = require("serverless-http");
const app = require("../src/app");
const dbConnect = require("../src/config/dbConnect");
const logger = require("../src/config/logger");

// Connect to your database (this runs on cold start)
(async () => {
  try {
    await dbConnect();
    logger.info("Database connected successfully.");
  } catch (error) {
    logger.error("Database connection failed:", error);
    // Depending on your needs, you might handle the error here.
  }
})();

// Export the handler for Vercel
module.exports.handler = serverless(app);
