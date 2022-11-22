import express from "express";
import {
  createVideo,
  deleteVideo,
  getAllVideo,
  getVideo,
  updateVideo,
} from "../controllers/video";
import { tokenMiddleware, uploadVideo } from "../middleware";

const router = express.Router();

router.get("/", getAllVideo);
router.get("/video", getVideo);
router.post("/", tokenMiddleware, uploadVideo.single("file"), createVideo);

router.put("/", tokenMiddleware, uploadVideo.single("file"), updateVideo);

router.delete("/", tokenMiddleware, deleteVideo);

export default router;
