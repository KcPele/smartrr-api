"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    imgUrl: [
        {
            key: { type: String, required: true },
            url: { type: String, required: true },
            imgName: { type: String },
        },
    ],
    description: { type: String, required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
});
exports.default = (0, mongoose_1.model)("Product", productSchema);
//# sourceMappingURL=product.js.map