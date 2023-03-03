"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    paymentRef: { type: String, required: true },
    state: { type: String, required: true },
    localGovernmentArea: { type: String, required: true },
    address: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    deliveryFee: { type: String, required: true },
    totalAmount: { type: String, required: true },
    majorLandmark: { type: String, required: true },
    status: {
        type: String,
        default: "processing",
        enum: ["processing", "shipped", "delivered"],
    },
    phoneNumber: { type: String, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=order.js.map