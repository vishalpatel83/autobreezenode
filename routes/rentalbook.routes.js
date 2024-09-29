import express from "express";
import { RentalController } from "../controllers/rentalbook.controller.js";

const router=express.Router();
router.post("/bookrental",RentalController.bookRental);
router.post("/checkCarAvailability",RentalController.checkCarAvailability);


export default router;