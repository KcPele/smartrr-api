"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    key: { type: String, required: true },
    url: { type: String, required: true },
    imgName: { type: String },
});
exports.default = (0, mongoose_1.model)("Image", imageSchema);
//# sourceMappingURL=image.js.map