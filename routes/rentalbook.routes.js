import express from "express";
import { RentalController } from "../controllers/rentalbook.controller.js";

const router=express.Router();
router.post("/bookrental",RentalController.bookRental);

export default router;