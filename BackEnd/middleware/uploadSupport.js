import multer from "multer";
import path from "path";
import fs from "fs";

/* ================= FOLDER ================= */
const SUPPORT_DIR = "uploads/support";

if (!fs.existsSync(SUPPORT_DIR)) {
  fs.mkdirSync(SUPPORT_DIR, { recursive: true });
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SUPPORT_DIR);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/* ================= FILE FILTER ================= */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

/* ================= EXPORT ================= */
const uploadSupport = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
  },
});

export default uploadSupport;
