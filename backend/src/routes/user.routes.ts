import { Router } from "express";
import { getAllUser, loginUser, registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/").get(getAllUser)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

export default router;