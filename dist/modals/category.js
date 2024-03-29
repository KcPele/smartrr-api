"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    // owner: { type: Schema.Types.ObjectId, ref: "User" },
});
exports.default = (0, mongoose_1.model)("Category", categorySchema);
//# sourceMappingURL=category.js.map