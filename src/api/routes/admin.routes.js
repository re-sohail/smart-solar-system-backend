const adminRoutes = require("express").Router();
const adminController = require("../../controllers/admin.controllers");
const { authMiddleware, permit } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validateSchema.middleware");
const { approveUserSchema } = require("../../utils/bodyData.validate");

adminRoutes.get(
  "/user-list",
  authMiddleware,
  permit("admin"),
  adminController.userList
);

// approve user by admin
adminRoutes.patch(
  "/approve-user/:userId",
  validate(approveUserSchema),
  authMiddleware,
  permit("admin"),
  adminController.approveUser
);

module.exports = adminRoutes;
