"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhook_1 = require("../controllers/webhook");
const router = (0, express_1.Router)();
router.get("/paystack", webhook_1.paystackWebhook);
exports.default = router;
//# sourceMappingURL=webhook.js.map