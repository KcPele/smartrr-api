"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createNewUser = void 0;
// import * as dotenv from "dotenv";
// dotenv.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../modals/user"));
const privateKey = process.env.PRIVATE_KEY;
async function createNewUser(email, password) {
    //were to use bycript an jsonwebtokek
    const salt = await bcrypt_1.default.genSalt(10);
    const hashPassword = await bcrypt_1.default.hash(password, salt);
    try {
        const user = await user_1.default.create({ email, password: hashPassword });
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, privateKey, {
            expiresIn: 60 * 60 * 48,
        });
        return { _id: user._id, email: user.email, token };
    }
    catch (error) {
        let errors = error;
        return { errors: errors.message };
    }
}
exports.createNewUser = createNewUser;
async function loginUser(email, password) {
    //were to use bycript an jsonwebtokek
    const user = await user_1.default.findOne({ email });
    if (!user) {
        throw new Error("Wrong credentials please try again");
    }
    else {
        const comparedPass = await bcrypt_1.default.compare(password, user.password);
        if (!comparedPass) {
            throw new Error("Wrong credentials please try again");
        }
        else {
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, privateKey, {
                expiresIn: 60 * 60 * 48,
            });
            return { _id: user._id, email: user.email, token };
        }
    }
}
exports.loginUser = loginUser;
//# sourceMappingURL=user.js.map