const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Try Cloudinary upload if available, otherwise return base64 / data URL
    try {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'gifto_products',
      });

      return res.json({
        success: true,
        url: result.secure_url,
      });
    } catch (cErr) {
      // Fallback data URI
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      return res.json({
        success: true,
        url: dataURI,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage };
