"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String },
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
    views: { type: Number },
    rating: { type: Number },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category" },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Video", videoSchema);
//# sourceMappingURL=video.js.map