"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.deleteCategory = exports.createCategory = exports.getAllCategory = void 0;
const user_1 = __importDefault(require("../modals/user"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const category_1 = __importDefault(require("../modals/category"));
const getAllCategory = (0, express_async_handler_1.default)(async (req, res) => {
    let categories = (await category_1.default.find({}));
    res.status(200).json({ categories });
});
exports.getAllCategory = getAllCategory;
const createCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { name } = req.body;
    try {
        const owner = await user_1.default.findById(req.userId);
        const category = await category_1.default.create({
            name,
        });
        res.status(200).json(category);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createCategory = createCategory;
const updateCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    const update = { name };
    let query = { _id: categoryId };
    let category = await category_1.default.findOneAndUpdate(query, update, {
        new: true,
    });
    res.status(200).json(category);
});
exports.updateCategory = updateCategory;
const deleteCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { categoryId } = req.params;
    let query = { _id: categoryId };
    category_1.default.findOneAndDelete(query)
        .then((category) => {
        res.status(200).json(category);
    })
        .catch((err) => {
        res.status(400).json(err);
    });
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.js.map