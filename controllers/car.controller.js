import db from "./../db/db.js";
import multer from "multer";
import path from "path";
import { ResultModal } from "../common/response.js";
import { error } from "console";

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

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
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

export class CarController {
  constructor() {}

  static async uploadImage(req, res) {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // If successful, return the uploaded file info
      return res
        .status(200)
        .json({ message: "Images uploaded successfully", files: req.files });
    });
  }

  static async addCar(req, res) {
    // First, handle file uploads
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }

      try {
        const {
          title,
          category,
          daily_price,
          weekly_price,
          monthly_price,
          section1_title,
          section1_description,
          section2_title,
          section2_description,
          key_features,
          capacity
        } = req.body;

        // Log the body and files for debugging purposes
        console.log("Request body: ", req.body);
        console.log("Uploaded files: ", req.files);

        // Gather the filenames of the uploaded images
        const img = req.files["img"] ? req.files["img"][0].filename : null;
        const section1Image = req.files["section1_images"]
          ? req.files["section1_images"][0].filename
          : null;
        const section2Image = req.files["section2_images"]
          ? req.files["section2_images"][0].filename
          : null;
        const keyFeatureImage = req.files["key_feature_img"]
          ? req.files["key_feature_img"][0].filename
          : null;

        // Insert the data into the database
        const result = await db.execute(
          "INSERT INTO car (title, category, daily_price ,weekly_price ,monthly_price ,img, section1_title, section1_description, section1_images, section2_title, section2_description, section2_images, key_features, key_feature_img,capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
          [
            title, // car title
            category, // car category
            daily_price,
            weekly_price,
            monthly_price, // car price
            img, // car img field
            section1_title, // section 1 title
            section1_description, // section 1 description
            section1Image, // section 1 image
            section2_title, // section 2 title
            section2_description, // section 2 description
            section2Image, // section 2 image
            key_features, // key features
            keyFeatureImage, // key feature image
            capacity
          ]
        );

        // Return success response
        res.status(201).json({
          result,
        });
      } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ error: "Failed to create car" });
      }
    });
  }

  static async getCarDetailById(req, res) {
    try {
      const { id } = req.params;
      const query = "SELECT * FROM car WHERE car_id = ?";
      db.query(query, [id], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        if (result.length === 0) {
          return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json(result[0]); // return only the first result (since IDs are unique)
      });
    } catch (error) {}
  }

  //search api for the get car
  static async searchCar(req, res) {
    const { categories, capacities, searchText } = req.body;
    try {
      let sql = `SELECT * FROM car WHERE 1=1`; // Start with a base query
      const values = [];
      // Conditionally add the category filter
      if (categories && categories.length > 0) {
        sql += ` AND category IN (?)`;
        values.push(categories); // Add categories to the values array
      }
    
      // Conditionally add the capacity filter
      if (capacities && capacities.length > 0) {
        sql += ` AND capacity IN (?)`;
        values.push(capacities); // Add capacities to the values array
      }
    
      // Conditionally add the search text filter for title and description
      // if (searchText && searchText.trim() !== "") {
        sql += ` AND (title LIKE ? )`;
        const searchTerm = `%${searchText}%`;
        values.push(searchTerm, searchTerm); // Add searchTerm for both title and description
      // }
    

      // Execute the query
       db.query(sql, values,(err,result)=>{
        console.log(sql)
        if(err){
          throw new Error(err)
        }
        if(result){
          const searchResult = result[0];
          console.log(searchResult)
          const data = new ResultModal(searchResult??[], "", 200, true, "");
          return res.status(200).json(data);
        }
      });
      
    } catch (error) {
      const data = new ResultModal([], "", 400, false, error.message);
      return res.status(200).json(data);
    }
  }
}
