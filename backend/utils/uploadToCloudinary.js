const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (allowedImageMimeTypes.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG and WEBP image files are allowed"));
    }
  },
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

const uploadBufferToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      reject(new Error("File buffer is missing"));
      return;
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      reject(new Error("Cloudinary environment variables are missing"));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });

const uploadSingleImage = async (file, folder) => {
  if (!file) return null;
  return uploadBufferToCloudinary(file, folder);
};

const uploadMultipleImages = async (files, folder) => {
  const items = Array.isArray(files) ? files : [];

  const uploaded = [];

  for (const file of items) {
    const result = await uploadSingleImage(file, folder);
    if (result) {
      uploaded.push(result);
    }
  }

  return uploaded;
};

const runMiddleware = (middleware, req, res) =>
  new Promise((resolve, reject) => {
    middleware(req, res, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

module.exports = {
  imageUpload,
  uploadSingleImage,
  uploadMultipleImages,
  runMiddleware,
};
