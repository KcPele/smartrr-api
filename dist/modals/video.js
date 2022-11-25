"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    uploadTime: { type: String },
    thumbnail: {
        key: { type: String, required: true },
        url: { type: String, required: true },
        name: { type: String },
    },
    video: {
        key: { type: String, required: true },
        url: { type: String, required: true },
        name: { type: String },
    },
    // videoKey: { type: String, required: true },
    // videoName: { type: String, required: true },
    // videoUrl: { type: String, required: true },
    // thumbnailKey: { type: String, required: true },
    // thumbnailUrl: { type: String, required: true },
    // thumbnailName: { type: String, required: true },
    views: { type: Number },
    rating: { type: Number },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category" },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
});
videoSchema.pre("save", function (next) {
    this.uploadTime = Date.now().toString();
    next();
});
exports.default = (0, mongoose_1.model)("Video", videoSchema);
//# sourceMappingURL=video.js.map