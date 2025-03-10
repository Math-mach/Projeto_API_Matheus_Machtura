const express = require("express");
const activityController = require("../controllers/activityController");
const jtwMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(jtwMiddleware);

router.get("/list", activityController.listActivities);
router.post("/join/:id", activityController.joinActivity);
router.post("/leave/:id", activityController.leaveActivity);

router.use(adminMiddleware);

router.post("/create", activityController.createActivity);
router.put("/update/:id", activityController.updateActivity);
router.delete("/delete", activityController.deleteActivity);

module.exports = router;
