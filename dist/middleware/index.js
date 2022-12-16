"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderTokenMiddleware = exports.tokenMiddleware = exports.upload = exports.uploadVideo = exports.s3DeleteHelper = exports.s3Config = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const user_1 = __importDefault(require("../modals/user"));
exports.s3Config = new client_s3_1.S3Client({
    region: "us-west-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_ACCESS_SECRET,
    },
});
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    region: "us-west-1",
});
const s3DeleteHelper = (key) => {
    s3.deleteObject({
        Bucket: process.env.s3_BUCKET,
        Key: key,
    }, (err, data) => {
        if (err) {
            console.error("err", err);
        }
    });
};
exports.s3DeleteHelper = s3DeleteHelper;
exports.uploadVideo = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: exports.s3Config,
        bucket: "mini-test-dashboard",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, "videos/" + Date.now().toString() + "-" + file.originalname);
        },
    }),
});
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: exports.s3Config,
        bucket: "mini-test-dashboard",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, "images/" + Date.now().toString() + "-" + file.originalname);
        },
    }),
});
const tokenMiddleware = async (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    try {
        const userId = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY);
        let user = await user_1.default.findById(userId === null || userId === void 0 ? void 0 : userId._id);
        if (!user) {
            res.status(400).json({ error: "wrong credentials" });
        }
        else {
            req.userId = userId._id;
            next();
        }
    }
    catch (error) {
        // console.log(error)
        let errors = error;
        res.status(500).json({ error: errors.message });
    }
};
exports.tokenMiddleware = tokenMiddleware;
const orderTokenMiddleware = async (req, res, next) => {
    var _a, _b;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    try {
        const val = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY);
        if (((_b = val === null || val === void 0 ? void 0 : val.orderKey) === null || _b === void 0 ? void 0 : _b.toString()) !== process.env.ORDER_PRIVATE_KEY) {
            res.status(400).json({ error: "not a valid token" });
        }
        else {
            next();
        }
    }
    catch (error) {
        // console.log(error)
        let errors = error;
        res.status(500).json({ error: errors.message });
    }
};
exports.orderTokenMiddleware = orderTokenMiddleware;
//# sourceMappingURL=index.js.map