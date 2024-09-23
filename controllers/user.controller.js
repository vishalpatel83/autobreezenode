import { ResultModal } from "../common/response.js";
import db from "../db/db.js";
import fs from "fs";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder where the files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueName = `${
      req.params.userId
    }-driving_license-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Initialize upload for driving license
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Set file size limit to 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) and PDFs are allowed!"));
    }
  },
}).single("driving_license_file"); // expects a file field named 'driving_license_file'

export const signUpUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    const data = new ResultModal(
      [],
      "",
      400,
      false,
      "Email and password are required"
    );
    return res.status(400).json(data);
  }

  // Insert user into the database
  const query = "INSERT INTO user (email, password) VALUES (?, ?)";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      // console.error('Error inserting user:', err);
      const data = new ResultModal([], "", 400, false, err.message);
      return res.status(400).json(data);
      // return res.status(500).json({ message: 'Database error' });
    }

    // Respond with the created user ID
    const data = new ResultModal(
      "",
      "User created successfully",
      201,
      true,
      ""
    );
    return res.status(201).json(data);
  });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const data = new ResultModal(
      [],
      "",
      400,
      false,
      "Email and password are required"
    );
    return res.status(400).json(data);
  }

  // Query to find the user with matching email and password
  const query = "SELECT * FROM user WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      const data = new ResultModal([], "", 400, false, err.message);
      return res.status(400).json(data);
    }

    // If no user found, return error
    if (results.length === 0) {
      const data = new ResultModal(
        [],
        "",
        400,
        false,
        "Invalid email or password"
      );
      return res.status(401).json(data);
    }

    // If a matching user is found, login is successful
    const data = new ResultModal(
      results[0],
      "Login successfully",
      201,
      true,
      ""
    );
    return res.status(200).json(data);
  });
};

export const updateUser = (req, res) => {
  try {
    const userId = req.params.userId;
    let drivingLicenseFilePath;
    upload(req, res, (err) => {
      console.log("req",req.file,req.files)
      drivingLicenseFilePath = req.file.filename
      // ? `uploads/${req.file.filename}`
      // : null;
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      const {
        first_name,
        middle_name,
        last_name,
        mobile_number,
        email,
        password,
        nationality,
        address_line1,
        address_line2,
        pin_code,
        dl_number,
        passport_number,
      } = req.body;
      console.log(req.files)
      // Check if file is uploaded and prepare file path


      // SQL query to update user details
      const sql = `
            UPDATE user 
            SET 
                first_name = ?, 
                middle_name = ?, 
                last_name = ?, 
                mobile_number = ?, 
                email = ?, 
                password = ?, 
                nationality = ?, 
                address_line1 = ?, 
                address_line2 = ?, 
                pin_code = ?, 
                dl_number = ?, 
                passport_number = ?, 
                driving_license_file = ?
            WHERE user_id = ?`;
console.log("drivingLicenseFilePath",drivingLicenseFilePath)
      const values = [
        first_name,
        middle_name,
        last_name,
        mobile_number,
        email,
        password,
        nationality,
        address_line1,
        address_line2,
        pin_code,
        dl_number,
        passport_number,
        drivingLicenseFilePath,
        userId,
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.log(err)
          if (req.file) {
            // Delete the file in case of DB error
            fs.unlinkSync(req.file.path);
          }
          const data = new ResultModal([], "", 400, false,"Database error");
          return res
            .status(400)
            .json(data);
        }
        const data = new ResultModal([], "User updated successfully", 200, true, "");
          return res.status(200).json(data);
        
      });
    });
  } catch (error) {
    const data = new ResultModal([], "", 400, false, error.message);
    return res.status(400).json(data);
  }
};
