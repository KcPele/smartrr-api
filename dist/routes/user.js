"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// import * as dotenv from "dotenv";
// dotenv.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../modals/user"));
const privateKey = process.env.PRIVATE_KEY;
const router = express_1.default.Router();
router.post("/login", (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_1.default.findOne({ email });
    if (!user) {
        res.status(400).json({ error: "Wrong credentials please try again" });
    }
    else {
        const comparedPass = await bcrypt_1.default.compare(password, user.password);
        if (!comparedPass) {
            res.status(400).json({ error: "Wrong credentials please try again" });
        }
        else {
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, privateKey, {
                expiresIn: 60 * 60 * 48,
            });
            res.status(200).json({ _id: user._id, email: user.email, token });
        }
    }
}));
router.post("/register", (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (password.length < 6) {
        res.status(400).json({ error: "Password must be up to 6 characters" });
    }
    else {
        const user = await user_1.default.createNewUser(email, password);
        res.status(200).json(user);
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map