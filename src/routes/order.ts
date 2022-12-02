import express from "express";
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
router.post("/", createOrder);
router.put("/:orderId", updateOrder);
router.delete("/:orderId", deleteOrder);

export default router;
