import express from "express";
import Product from "../modals/product";

import { s3DeleteHelper, tokenMiddleware } from "../middleware";
import asyncHandler from "express-async-handler";
const router = express.Router();
router.delete(
  "/",
  tokenMiddleware,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { productId, imgKey, imgId } = req.query;
    console.log(productId);
    Product.updateOne(
      { _id: productId },
      { $pull: { imgUrl: { _id: imgId } } },
      function (err: any, numAffected: any) {
        if (err) {
          console.log(err);
          res.status(400).json(err);
        } else {
          s3DeleteHelper(imgKey as string);
          res.status(200).json("successful");
        }
      }
    );
  })
);

export default router;
