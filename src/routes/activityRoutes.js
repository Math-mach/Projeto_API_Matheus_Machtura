const express = require("express");
const activityController = require("../controllers/activityController");
const jtwMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/list", activityController.listActivities);
router.post("/join/:id", activityController.joinActivity);
router.post("/leave/:id", activityController.leaveActivity);

router.use(jtwMiddleware);
router.use(adminMiddleware);

router.post("/create", activityController.createActivity);
router.delete("/delete", activityController.deleteActivity);

module.exports = router;
