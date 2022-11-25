"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../controllers/product");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.get("/", product_1.getAllProduct);
router.get("/:productId", product_1.getProduct);
router.post("/", middleware_1.tokenMiddleware, middleware_1.upload.array("file", 5), product_1.createProduct);
router.put("/", middleware_1.tokenMiddleware, middleware_1.upload.array("file", 5), product_1.updateProduct);
router.delete("/", middleware_1.tokenMiddleware, product_1.deleteProduct);
router.delete("/product-image", middleware_1.tokenMiddleware, product_1.deleteProductImage);
exports.default = router;
//# sourceMappingURL=products.js.map