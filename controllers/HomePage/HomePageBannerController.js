const uploadToS3 = require("../../config/s3Uploader");
const HomePageBannerModel = require("../../models/Hompage/HomePageBannerSchema"); // make sure this is imported
const { deleteFromS3 } = require("../../config/s3Uploader"); // if needed

exports.createHomePageBanner = async (req, res) => {
  try {
    console.log("\n=========== CREATE HOME PAGE BANNER ===========");
    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);

    const { description } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!description) {
      return res.status(400).json({
        message: "Please provide the description",
      });
    }

    console.log("✅ VALIDATION PASSED");

    /* ---------------- S3 UPLOADS ---------------- */
    const bannerData = { description };


    if (req.files?.mobileImage?.length > 0) {
      console.log("🚀 Uploading image...");
      bannerData.imageForMobile = await uploadToS3(req.files.mobileImage[0], "home-banners")
    }

    if (req.files?.image?.length > 0) {
      console.log("🚀 Uploading image...");
      bannerData.image = await uploadToS3(req.files.image[0], "home-banners");
    }

    if (req.files?.hexaImage?.length > 0) {
      console.log("🚀 Uploading hexaImage...");
      bannerData.hexaImage = await uploadToS3(req.files.hexaImage[0], "home-banners");
    }

    if (req.files?.hexaLogo?.length > 0) {
      console.log("🚀 Uploading hexaLogo...");
      bannerData.hexaLogo = await uploadToS3(req.files.hexaLogo[0], "home-banners");
    }

    console.log("✅ FILE UPLOADS COMPLETE");

    /* ---------------- DB SAVE ---------------- */
    const banner = new HomePageBannerModel(bannerData);
    await banner.save();

    console.log("🎉 HOME PAGE BANNER CREATED");

    res.status(201).json({
      message: "Home page banner created successfully",
      banner,
    });

  } catch (error) {
    console.error("🔥 CREATE HOME PAGE BANNER ERROR:", error);
    res.status(500).json({
      message: "Failed to create home page banner",
      error: error.message,
    });
  }
};


exports.getAllHomePageBanners = async (req, res) => {
  try {
    const banners = await HomePageBannerModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: banners.length,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch banners",
      error: error.message,
    });
  }
};
exports.getHomePageBannerById = async (req, res) => {
  try {
    const banner = await HomePageBannerModel.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch banner",
      error: error.message,
    });
  }
};
exports.updateHomePageBanner = async (req, res) => {
  try {
    const banner = await HomePageBannerModel.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (req.body.description) {
      banner.description = req.body.description;
    }

    if (req.files?.image) {
      banner.image = await uploadToS3(
        req.files.image[0],
        "home-banners"
      );
    }
    if (req.files?.mobileImage?.length > 0) {
      console.log("🚀 Uploading image...");
      banner.imageForMobile = await uploadToS3(req.files.mobileImage[0], "home-banners")
    }
    if (req.files?.hexaImage) {
      banner.hexaImage = await uploadToS3(
        req.files.hexaImage[0],
        "home-banners"
      );
    }

    if (req.files?.hexaLogo) {
      banner.hexaLogo = await uploadToS3(
        req.files.hexaLogo[0],
        "home-banners"
      );
    }

    await banner.save();

    res.status(200).json({
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    console.error("🔥 UPDATE HOME PAGE BANNER ERROR:", error);
    res.status(500).json({
      message: "Update banner failed",
      error: error.message,
    });
  }
};
exports.deleteHomePageBanner = async (req, res) => {
  try {
    const banner = await HomePageBannerModel.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await banner.deleteOne();

    res.status(200).json({
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete banner failed",
      error: error.message,
    });
  }
};


