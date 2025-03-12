const router = require("express").Router();
const authRoutes = require("../api/routes/auth.routes");
const adminRoutes = require("../api/routes/admin.routes");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
