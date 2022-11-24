import express from "express";
import {
  getAllCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category";
import { tokenMiddleware } from "../middleware";

const router = express.Router();

router.get("/", getAllCategory);

router.post("/", tokenMiddleware, createCategory);
router.put("/", tokenMiddleware, updateCategory);
router.delete("/", tokenMiddleware, deleteCategory);

export default router;
