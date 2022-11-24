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
router.post(
  "/",
  tokenMiddleware,
  uploadVideo.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createVideo
);

router.put(
  "/",
  tokenMiddleware,
  uploadVideo.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateVideo
);

router.delete("/", tokenMiddleware, deleteVideo);

export default router;
