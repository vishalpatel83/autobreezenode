import express from "express";
import { CarController } from "../controllers/car.controller.js";
import bodyParser from "body-parser";

const router=express.Router();
router.post("/upload",CarController.uploadImage);
router.post("/addcar",  bodyParser.urlencoded({ limit: '50mb', extended: true }) 
,CarController.addCar);
router.get("/:id",CarController.getCarDetailById);
router.post("/search",CarController.searchCar);

export default router;