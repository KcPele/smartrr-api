import express from "express";
import { orderTokenMiddleware } from "../middleware";
import {
  getAllOrder,
  getAnOrder,
  createOrder,
  deleteOrder,
  updateOrder,
} from "../controllers/order";

const router = express.Router();

router.get("/", getAllOrder);

router.get("/:orderId", getAnOrder);
router.post("/", orderTokenMiddleware, createOrder);
router.put("/:orderId", orderTokenMiddleware, updateOrder);
router.delete("/:orderId", orderTokenMiddleware, deleteOrder);

export default router;
