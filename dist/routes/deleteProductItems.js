"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../modals/product"));
const middleware_1 = require("../middleware");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = express_1.default.Router();
router.delete("/", middleware_1.tokenMiddleware, (0, express_async_handler_1.default)(async (req, res) => {
    const { productId, itemId } = req.query;
    product_1.default.updateOne({ _id: productId }, { $pull: { items: { _id: itemId } } }, function (err, numAffected) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).json("successful");
        }
    });
}));
exports.default = router;
//# sourceMappingURL=deleteProductItems.js.map