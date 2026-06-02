const express = require("express");
const router = express.Router();
const goalController = require("../../controllers/HomePage/HomePageGoalController");
const upload = require("../../middlewares/upload");

// CRUD routes
router.post("/", upload.single("image") ,  goalController.createGoal);        // Create
router.get("/", goalController.getAllGoals);       // Read all
router.get("/:id", goalController.getGoal);        // Read single
router.put("/:id", upload.single("image"), goalController.updateGoal);     // Update
router.delete("/:id", goalController.deleteGoal);  // Delete

module.exports = router;
