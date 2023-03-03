import express from "express";
import Product from "../models/product";

import { tokenMiddleware } from "../middleware";
import asyncHandler from "express-async-handler";
const router = express.Router();
router.delete(
  "/",
  tokenMiddleware,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { productId, itemId } = req.query;
    Product.updateOne(
      { _id: productId },
      { $pull: { items: { _id: itemId } } },
      function (err: any, numAffected: any) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json("successful");
        }
      }
    );
  })
);

export default router;
