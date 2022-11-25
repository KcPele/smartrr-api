"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getAllProduct = void 0;
const user_1 = __importDefault(require("../modals/user"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const product_1 = __importDefault(require("../modals/product"));
const middleware_1 = require("../middleware");
const getAllProduct = (0, express_async_handler_1.default)(async (req, res) => {
    let products = (await product_1.default.find({}));
    res.status(200).json({ products });
});
exports.getAllProduct = getAllProduct;
const getProduct = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    let product = (await product_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.productId));
    res.status(200).json({ product });
});
exports.getProduct = getProduct;
const createProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, price, description } = req.body;
    let imgUrl = [];
    if (req.files) {
        let files = req.files;
        imgUrl = files === null || files === void 0 ? void 0 : files.reduce((acc, image) => [
            ...acc,
            { key: image.key, url: image.location, imgName: image.originalname },
        ], []);
    }
    try {
        const owner = await user_1.default.findById(req.userId);
        const product = await product_1.default.create({
            name,
            price,
            imgUrl,
            description,
            owner,
        });
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createProduct = createProduct;
const updateProduct = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    let id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.productId;
    const { name, price, description } = req.body;
    const update = { name, price, description };
    if (req.files) {
        let product = await product_1.default.findById(id);
        let imgLength = product === null || product === void 0 ? void 0 : product.imgUrl.length;
        if (imgLength > 5)
            res.status(400).json({ error: "Cannot upload more than 5 images" });
        let files = req.files;
        files.map((image) => {
            product === null || product === void 0 ? void 0 : product.imgUrl.push({
                key: image.key,
                url: image.location,
                imgName: image.originalname,
            });
        });
        product === null || product === void 0 ? void 0 : product.save();
    }
    let query = { _id: id, owner: req.userId };
    let product = await product_1.default.findOneAndUpdate(query, update, {
        new: true,
    });
    res.status(200).json(product);
});
exports.updateProduct = updateProduct;
const deleteProduct = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    let id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.productId;
    console.log(id);
    let query = { _id: id, owner: req.userId };
    product_1.default.findOneAndDelete(query)
        .then((product) => {
        product === null || product === void 0 ? void 0 : product.imgUrl.map((val) => {
            (0, middleware_1.s3DeleteHelper)(val.key);
        });
        res.status(200).json(product);
    })
        .catch((err) => {
        res.status(400).json(err);
    });
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.js.map