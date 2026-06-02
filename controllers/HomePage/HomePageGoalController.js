const uploadToS3 = require("../../config/s3Uploader");
const GoalModel = require("../../models/Hompage/HomePageGoalSchema");

// Create a new Goal
exports.createGoal = async (req, res) => {
    try {
        const { heading1, heading2, heading3, paragraphDescription } = req.body;

        if (!heading1 || !heading2 || !heading3 || !paragraphDescription) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Make sure variable name is consistent
        const imageUrl = await uploadToS3(req.file, "homeGoal");
        console.log(imageUrl);

        const goal = await GoalModel.create({
            image: imageUrl, // use the same variable
            heading1,
            heading2,
            heading3,
            paragraphDescription,
        });

        res.status(201).json({ success: true, data: goal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// Get all Goals
exports.getAllGoals = async (req, res) => {
    try {
        const goals = await GoalModel.find();
        res.status(200).json({ success: true, data: goals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get single Goal
exports.getGoal = async (req, res) => {
    try {
        const goal = await GoalModel.findById(req.params.id);
        if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });
        res.status(200).json({ success: true, data: goal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update Goal
exports.updateGoal = async (req, res) => {
    try {
        console.log("UPDATE GOAL CALLED");
        console.log("PARAMS ID:", req.params.id);
        console.log("BODY:", req.body);
        let updateData = { ...req.body };
        
        // If a new image was uploaded during the update, upload it to S3 and add it to updateData
        if (req.file) {
            console.log("FILE UPLOADED, uploading to S3...");
            const imageUrl = await uploadToS3(req.file, "homeGoal");
            updateData.image = imageUrl;
        }

        const updatedGoal = await GoalModel.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        console.log("UPDATED GOAL:", updatedGoal);
        if (!updatedGoal) return res.status(404).json({ success: false, message: "Goal not found" });

        res.status(200).json({ success: true, data: updatedGoal });
    } catch (error) {
        console.error("ERROR IN UPDATE GOAL:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete Goal
exports.deleteGoal = async (req, res) => {
    try {
        const deletedGoal = await GoalModel.findByIdAndDelete(req.params.id);
        if (!deletedGoal) return res.status(404).json({ success: false, message: "Goal not found" });
        res.status(200).json({ success: true, message: "Goal deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
