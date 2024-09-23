import express from "express";
import {
  signIn,
  signUpUser,
  updateUser,
} from "../controllers/user.controller.js";
import bodyParser from "body-parser";
// import { RentalController } from "../controllers/rentalbook.controller.js";

const router = express.Router();
router.post("/signup", signUpUser);
router.post("/signin", signIn);
router.put("/:userId", bodyParser.urlencoded({ limit: '50mb', extended: true }) , updateUser);

export default router;
