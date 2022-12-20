import express from "express";
import {  tokenMiddleware } from "../middleware";
import {
  getAllOrder,
  getAnOrder,
  deleteOrder,
  updateOrder,
} from "../controllers/order";

const router = express.Router();

router.get("/", getAllOrder);

router.get("/:orderId", getAnOrder);
router.put("/:orderId", tokenMiddleware, updateOrder);
router.delete("/:orderId", tokenMiddleware, deleteOrder);

export default router;
