import { Router } from "express";
import { paystackWebhook } from "../controllers/webhook";

const router = Router();

router.get("/paystack", paystackWebhook);

export default router;
