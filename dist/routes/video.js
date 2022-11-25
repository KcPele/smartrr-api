"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const video_1 = require("../controllers/video");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.get("/", video_1.getAllVideo);
router.get("/:videoId", video_1.getVideo);
router.post("/", middleware_1.tokenMiddleware, middleware_1.uploadVideo.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), video_1.createVideo);
router.put("/:videoId", middleware_1.tokenMiddleware, middleware_1.uploadVideo.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), video_1.updateVideo);
router.delete("/:videoId", middleware_1.tokenMiddleware, video_1.deleteVideo);
exports.default = router;
//# sourceMappingURL=video.js.map