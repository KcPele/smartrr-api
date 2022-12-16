"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const order_1 = require("../controllers/order");
const router = express_1.default.Router();
router.get("/", order_1.getAllOrder);
router.get("/:orderId", order_1.getAnOrder);
router.post("/", middleware_1.orderTokenMiddleware, order_1.createOrder);
router.put("/:orderId", middleware_1.orderTokenMiddleware, order_1.updateOrder);
router.delete("/:orderId", middleware_1.orderTokenMiddleware, order_1.deleteOrder);
exports.default = router;
//# sourceMappingURL=order.js.map