"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrder = void 0;
const order_1 = __importDefault(require("../../models/order"));
const CreateOrder = async (data) => {
    const order = await order_1.default.create(data);
    return order;
};
exports.CreateOrder = CreateOrder;
//# sourceMappingURL=CreateOrder.js.map