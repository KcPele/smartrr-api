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
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const products_1 = __importDefault(require("./routes/products"));
const video_1 = __importDefault(require("./routes/video"));
const category_1 = __importDefault(require("./routes/category"));
const deleteImage_1 = __importDefault(require("./routes/deleteImage"));
const deleteProductItems_1 = __importDefault(require("./routes/deleteProductItems"));
const order_1 = __importDefault(require("./routes/order"));
dotenv.config();
mongoose_1.default
    .connect(process.env.MONGODB_URL)
    .then((val) => {
    console.log("connected");
})
    .catch((err) => {
    console.log(err);
});
mongoose_1.default.connection.on("connecting", function () {
    console.log("connecting to MongoDB...");
});
mongoose_1.default.connection.on("error", function (error) {
    console.error("Error in MongoDb connection: " + error);
    mongoose_1.default.disconnect();
});
mongoose_1.default.connection.on("connected", function () {
    console.log("MongoDB connected!");
});
mongoose_1.default.connection.once("open", function () {
    console.log("MongoDB connection opened!");
});
mongoose_1.default.connection.on("reconnected", function () {
    console.log("MongoDB reconnected!");
});
if (!process.env.PORT) {
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10);
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// {
//   allowedHeaders: ["sessionId", "Content-Type"],
//   exposedHeaders: ["sessionId"],
//   origin: "*",
//   methods: "GET,HEAD,PUT,POST,DELETE",
//   preflightContinue: false,
// }
app.use(express_1.default.json());
app.use("/user", user_1.default);
app.use("/orders", order_1.default);
app.use("/videos", video_1.default);
app.use("/products", products_1.default);
app.use("/remove", deleteImage_1.default);
app.use("/categories", category_1.default);
app.use("/remove-item", deleteProductItems_1.default);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map