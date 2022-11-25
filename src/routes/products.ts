import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
  deleteProductImage,
  getProduct,
} from "../controllers/product";
import { tokenMiddleware, upload } from "../middleware";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/:productId", getProduct);
router.post("/", tokenMiddleware, upload.array("file", 5), createProduct);

router.put(
  "/:productId",
  tokenMiddleware,
  upload.array("file", 5),
  updateProduct
);

router.delete(
  "/:productId/:imgId/:imgKey",
  tokenMiddleware,
  deleteProductImage
);
router.delete("/:productId", tokenMiddleware, deleteProduct);

export default router;
