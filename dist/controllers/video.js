"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.updateVideo = exports.createVideo = exports.getVideo = exports.getAllVideo = void 0;
const user_1 = __importDefault(require("../modals/user"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const video_1 = __importDefault(require("../modals/video"));
const middleware_1 = require("../middleware");
const getAllVideo = (0, express_async_handler_1.default)(async (req, res) => {
    let searchQuery = {};
    if (req.query.category) {
        searchQuery.category = {
            _id: req.query.category,
        };
    }
    let videos = await video_1.default.find(searchQuery)
        .populate("category")
        .sort({ createdAt: -1 });
    res.status(200).json({ videos });
});
exports.getAllVideo = getAllVideo;
const getVideo = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    let id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.videoId;
    let videos = await video_1.default.findById(id).populate("category");
    await video_1.default.updateOne({ _id: id }, { $inc: { views: 1 } }, { new: true });
    res.status(200).json({ videos });
});
exports.getVideo = getVideo;
const createVideo = async (req, res) => {
    const { title, category, author, description } = req.body;
    if (!req.files)
        return res.status(400).json({ error: "no file selected" });
    let files = req.files;
    if (!files.thumbnail)
        return res.status(400).json({ error: "no thumbnail selected" });
    if (!files.video)
        return res.status(400).json({ error: "no video selected" });
    let thumbnail = {
        key: files.thumbnail[0].key,
        url: files.thumbnail[0].location,
        name: files.thumbnail[0].originalname,
    };
    let vid = {
        key: files.video[0].key,
        url: files.video[0].location,
        name: files.video[0].originalname,
    };
    try {
        const owner = await user_1.default.findById(req.userId);
        const video = await video_1.default.create({
            title,
            author,
            views: 0,
            rating: 0,
            video: vid,
            thumbnail,
            description,
            category,
            owner,
        });
        res.status(200).json(video);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createVideo = createVideo;
const updateVideo = (0, express_async_handler_1.default)(async (req, res) => {
    var _a, _b, _c;
    let id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.videoId;
    const { title, rating, author, category, description } = req.body;
    const update = {
        title,
        author,
        rating,
        category,
        description,
    };
    if (req.files) {
        let files = req.files;
        if (files === null || files === void 0 ? void 0 : files.thumbnail) {
            let video = await video_1.default.findById(id);
            (0, middleware_1.s3DeleteHelper)((_b = video === null || video === void 0 ? void 0 : video.thumbnail) === null || _b === void 0 ? void 0 : _b.key);
            let thumbnail = {
                key: files.thumbnail[0].key,
                url: files.thumbnail[0].location,
                name: files.thumbnail[0].originalname,
            };
            update.thumbnail = thumbnail;
        }
        if (files === null || files === void 0 ? void 0 : files.video) {
            let video = await video_1.default.findById(id);
            (0, middleware_1.s3DeleteHelper)((_c = video === null || video === void 0 ? void 0 : video.video) === null || _c === void 0 ? void 0 : _c.key);
            let vid = {
                key: files.video[0].key,
                url: files.video[0].location,
                name: files.video[0].originalname,
            };
            update.video = vid;
        }
    }
    let query = { _id: id, owner: req.userId };
    let video = await video_1.default.findOneAndUpdate(query, update, {
        new: true,
    });
    res.status(200).json(video);
});
exports.updateVideo = updateVideo;
const deleteVideo = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    let id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.videoId;
    let query = { _id: id, owner: req.userId };
    video_1.default.findOneAndDelete(query)
        .then((video) => {
        var _a, _b;
        (0, middleware_1.s3DeleteHelper)((_a = video === null || video === void 0 ? void 0 : video.video) === null || _a === void 0 ? void 0 : _a.key);
        (0, middleware_1.s3DeleteHelper)((_b = video === null || video === void 0 ? void 0 : video.thumbnail) === null || _b === void 0 ? void 0 : _b.key);
        res.status(200).json(video);
    })
        .catch((err) => {
        res.status(400).json(err);
    });
});
exports.deleteVideo = deleteVideo;
//# sourceMappingURL=video.js.map