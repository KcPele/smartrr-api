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
    let products = await product_1.default.find({}).sort({ updatedAt: -1 });
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
    let { name, price, productType, productItems, description } = req.body;
    let imgUrl = [];
    if (req.files) {
        let files = req.files;
        imgUrl = files === null || files === void 0 ? void 0 : files.reduce((acc, image) => [
            ...acc,
            { key: image.key, url: image.location, imgName: image.originalname },
        ], []);
    }
    let items = [];
    if (productItems) {
        let productItem = JSON.parse(productItems);
        productItem === null || productItem === void 0 ? void 0 : productItem.map((val) => {
            items.push({
                item: val.item,
                price: val.price,
                quantity: val.quantity,
            });
        });
    }
    try {
        const owner = await user_1.default.findById(req.userId);
        const product = await product_1.default.create({
            name,
            price,
            productType,
            items,
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
    const { name, productItems, rating, price, description } = req.body;
    const update = {
        name,
        price,
        rating,
        description,
    };
    let productUpdate = await product_1.default.findById(id);
    if (productItems) {
        let productItem = JSON.parse(productItems);
        productItem === null || productItem === void 0 ? void 0 : productItem.map((val) => {
            productUpdate === null || productUpdate === void 0 ? void 0 : productUpdate.items.push({
                item: val.item,
                price: val.price,
                quantity: val.quantity,
            });
        });
    }
    if (req.files) {
        let imgLength = productUpdate === null || productUpdate === void 0 ? void 0 : productUpdate.imgUrl.length;
        if (imgLength > 5)
            res.status(400).json({ error: "Cannot upload more than 5 images" });
        let files = req.files;
        files.map((image) => {
            productUpdate === null || productUpdate === void 0 ? void 0 : productUpdate.imgUrl.push({
                key: image.key,
                url: image.location,
                imgName: image.originalname,
            });
        });
    }
    productUpdate === null || productUpdate === void 0 ? void 0 : productUpdate.save();
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