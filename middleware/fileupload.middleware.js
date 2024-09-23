import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to store images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log("multer call");
    // Check if file is an image
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
}).fields([
  { name: "section1_images", maxCount: 1 },
  { name: "img", maxCount: 1 },
  { name: "section2_images", maxCount: 1 },
  { name: "key_feature_img", maxCount: 1 },
]);
export const uploadFiles = (req, res, next) => {
  console.log("miidle call");
  upload(req, res, async (err) => {
    console.log(req.body)
    console.log(err, req.files);
    if (err) {
        console.log("middle error")
      return res.status(400).json({ error: err });
    }
    next();
  });
};
