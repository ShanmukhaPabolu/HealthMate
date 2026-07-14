const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Check if Cloudinary is fully configured with actual keys (not placeholders)
const isConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
  process.env.CLOUDINARY_API_SECRET && 
  process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('[CLOUDINARY SERVICE] — Cloudinary initialized successfully.');
} else {
  console.warn('[CLOUDINARY SERVICE] — Cloudinary is not configured or uses placeholders. Falling back to local storage.');
}

/**
 * Uploads a local file to Cloudinary.
 * If Cloudinary is not configured or the upload fails, it falls back to a local relative URL.
 * Automatically cleans up the local file after upload if uploaded to Cloudinary.
 * 
 * @param {Object} file - The file object from Multer (req.file)
 * @returns {Promise<string>} - The URL of the uploaded resource
 */
const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const localFilePath = file.path;
  const relativeLocalUrl = `/uploads/${file.filename}`;

  if (!isConfigured) {
    return relativeLocalUrl;
  }

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'healthmate_reports',
      resource_type: 'auto'
    });

    // Delete temporary local file on success
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return result.secure_url;
  } catch (err) {
    console.error('[CLOUDINARY SERVICE] — Upload failed:', err.message);
    // Return relative URL as fallback so application doesn't break
    return relativeLocalUrl;
  }
};

module.exports = {
  isConfigured,
  uploadToCloudinary
};
