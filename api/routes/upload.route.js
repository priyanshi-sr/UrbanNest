import express from "express";
import multer from "multer";

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });


router.post("/upload", upload.array("images", 6), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
    }

    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
    res.json({ message: "Files uploaded successfully", fileUrls });
});

export default router;
