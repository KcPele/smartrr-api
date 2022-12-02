"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    paymentRef: { type: String, required: true },
    status: {
        type: String,
        default: "processing",
        enum: ["processing", "shipped", "delivered"],
    },
    phoneNumber: { type: String, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=order.js.map