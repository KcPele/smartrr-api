"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = require("../controllers/category");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.get("/", category_1.getAllCategory);
router.post("/:categoryId", middleware_1.tokenMiddleware, category_1.createCategory);
router.put("/", middleware_1.tokenMiddleware, category_1.updateCategory);
router.delete("/:categoryId", middleware_1.tokenMiddleware, category_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=category.js.map