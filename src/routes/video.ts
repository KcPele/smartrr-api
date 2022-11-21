import express from "express";
import {
  createVideo,
  deleteVideo,
  getAllVideo,
  updateVideo,
} from "../controllers/video";
import { tokenMiddleware, uploadVideo } from "../middleware";

const router = express.Router();

router.get("/", getAllVideo);

router.post("/", tokenMiddleware, uploadVideo.single("file"), createVideo);

router.put("/", tokenMiddleware, uploadVideo.single("file"), updateVideo);

router.delete("/", tokenMiddleware, deleteVideo);

export default router;
