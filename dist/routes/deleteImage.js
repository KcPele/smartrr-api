"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../models/product"));
const middleware_1 = require("../middleware");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = express_1.default.Router();
router.delete("/", middleware_1.tokenMiddleware, (0, express_async_handler_1.default)(async (req, res) => {
    const { productId, imgKey, imgId } = req.query;
    product_1.default.updateOne({ _id: productId }, { $pull: { imgUrl: { _id: imgId } } }, function (err, numAffected) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            (0, middleware_1.s3DeleteHelper)(imgKey);
            res.status(200).json("successful");
        }
    });
}));
exports.default = router;
//# sourceMappingURL=deleteImage.js.map