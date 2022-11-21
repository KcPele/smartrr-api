import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "../controllers/product";
import { tokenMiddleware, upload } from "../middleware";

const router = express.Router();

router.get("/", getAllProduct);

router.post("/", tokenMiddleware, upload.array("file", 5), createProduct);

router.put("/", tokenMiddleware, upload.array("file", 5), updateProduct);

router.delete("/", tokenMiddleware, deleteProduct);

export default router;
