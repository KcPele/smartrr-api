"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.deleteOrder = exports.getAnOrder = exports.getAllOrder = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const order_1 = __importDefault(require("../models/order"));
const getAllOrder = (0, express_async_handler_1.default)(async (req, res) => {
    let searchQuery = {};
    if (req.query.userId) {
        searchQuery.userId = req.query.userId;
    }
    let orders = await order_1.default.find(searchQuery);
    res.status(200).json({ orders });
});
exports.getAllOrder = getAllOrder;
const getAnOrder = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    let order = (await order_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.orderId));
    res.status(200).json({ order });
});
exports.getAnOrder = getAnOrder;
const updateOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const update = {
        status,
    };
    let query = { _id: orderId };
    let order = await order_1.default.findOneAndUpdate(query, update, {
        new: true,
    });
    res.status(200).json(order);
});
exports.updateOrder = updateOrder;
const deleteOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const { orderId } = req.params;
    let query = { _id: orderId };
    order_1.default.findOneAndDelete(query)
        .then((order) => {
        res.status(200).json(order);
    })
        .catch((err) => {
        res.status(400).json(err);
    });
});
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=order.js.map