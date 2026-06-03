// controllers/newsController.js
const News = require('../../models/News/newsModel');
const uploadToS3 = require('../../config/s3Uploader'); // same as mentor S3 uploader

/**
 * GET all news
 */
const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    console.error('FETCH ALL NEWS ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
};

/**
 * GET news by ID
 */
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (err) {
    console.error('FETCH NEWS ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
};

/**
 * CREATE news
 */
const createNews = async (req, res) => {
  try {
    console.log('CREATE NEWS HIT');
    console.log('FILES:', req.files);
    console.log('BODY:', req.body);

    // Check if image is provided
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'News image is required' });
    }

    // Upload image to S3
    const imageUrl = await uploadToS3(req.files.image[0], 'news');
    console.log('Uploaded Image URL:', imageUrl);

    const news = new News({
      ...req.body,
      imageUrl: imageUrl, // store S3 URL
    });

    await news.save();

    res.status(201).json({ message: 'News created successfully', news });
  } catch (err) {
    console.error('CREATE NEWS ERROR:', err);
    res.status(500).json({ message: 'Failed to create news', error: err.message });
  }
};

/**
 * UPDATE news
 */
const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    // Update fields
    if (req.body.type !== undefined) news.type = req.body.type;
    if (req.body.title !== undefined) news.title = req.body.title;
    if (req.body.description !== undefined) news.description = req.body.description;
    if (req.body.backgroundColor !== undefined) news.backgroundColor = req.body.backgroundColor;
    if (req.body.color !== undefined) news.color = req.body.color;
    if (req.body.arrowColor !== undefined) news.arrowColor = req.body.arrowColor;
    if (req.body.isExternal !== undefined) news.isExternal = req.body.isExternal;
    if (req.body.href !== undefined) news.href = req.body.href;
    if (req.body.file !== undefined) news.file = req.body.file;
    if (req.body.downloadColor !== undefined) news.downloadColor = req.body.downloadColor;

    // Update image if provided
    if (req.files && req.files.image) {
      news.imageUrl = await uploadToS3(req.files.image[0], 'news');
    }

    await news.save();

    res.json({ message: 'News updated successfully', news });
  } catch (err) {
    console.error('UPDATE NEWS ERROR:', err);
    res.status(500).json({ message: 'Failed to update news', error: err.message });
  }
};

/**
 * DELETE news
 */
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    console.error('DELETE NEWS ERROR:', err);
    res.status(500).json({ message: 'Failed to delete news', error: err.message });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
