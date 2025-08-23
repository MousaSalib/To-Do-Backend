import multer from "multer";

const MAX_SIZE = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed (jpeg/png/webp/gif)"));
    }
    cb(null, true);
  },
});
