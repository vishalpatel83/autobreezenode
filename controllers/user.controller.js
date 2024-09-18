import { ResultModal } from "../common/response.js";
import db from "../db/db.js"

export const signUpUser=async(req,res)=>{
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        const data = new ResultModal([], "", 400, false, "Email and password are required");
      return res.status(400).json(data);
    }
  
    // Insert user into the database
    const query = 'INSERT INTO user (email, password) VALUES (?, ?)';
    db.query(query, [email, password], (err, result) => {
      if (err) {
        // console.error('Error inserting user:', err);
        const data = new ResultModal([], "", 400, false, err.message);
        return res.status(400).json(data);
        // return res.status(500).json({ message: 'Database error' });
      }
  
      // Respond with the created user ID
      const data = new ResultModal("", "User created successfully", 201, true, "");
      return res.status(201).json(data);
    });
  
}

export const signIn=async(req,res)=>{
    const { email, password } = req.body;
   if (!email || !password) {
    const data = new ResultModal([], "", 400, false, "Email and password are required");
    return res.status(400).json(data);
      }
    
      // Query to find the user with matching email and password
      const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
      db.query(query, [email, password], (err, results) => {
        if (err) {
            const data = new ResultModal([], "", 400, false, err.message);
            return res.status(400).json(data);
        }
    
        // If no user found, return error
        if (results.length === 0) {
            const data = new ResultModal([], "", 400, false, "Invalid email or password");
            return res.status(401).json(data);
        }
    
        // If a matching user is found, login is successful
        const data = new ResultModal(results[0], "Login successfully", 201, true, "");
        return res.status(200).json(data);
      });
    
}