import express from "express";
import { signIn, signUpUser } from "../controllers/user.controller.js";
// import { RentalController } from "../controllers/rentalbook.controller.js";

const router=express.Router();
router.post("/signup",signUpUser);
router.post("/signin",signIn);

export default router;