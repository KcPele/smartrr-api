import express from "express";
import { getAllCategory, createCategory } from "../controllers/category";
import { tokenMiddleware, uploadVideo } from "../middleware";

const router = express.Router();

router.get("/", getAllCategory);

router.post("/", tokenMiddleware, uploadVideo.single("file"), createCategory);

export default router;
