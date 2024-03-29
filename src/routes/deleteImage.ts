import express from "express";
import Product from "../models/product";

import { s3DeleteHelper, tokenMiddleware } from "../middleware";
import asyncHandler from "express-async-handler";
import Course from "../models/course";
const router = express.Router();
router.delete(
  "/",
  tokenMiddleware,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { productId, imgKey, imgId } = req.query;

    Product.updateOne(
      { _id: productId },
      { $pull: { imgUrl: { _id: imgId } } },
      function (err: any, numAffected: any) {
        if (err) {
          res.status(400).json(err);
        } else {
          s3DeleteHelper(imgKey as string);
          res.status(200).json("successful");
        }
      }
    );
  })
);

router.delete(
  "/coursefile",
  tokenMiddleware,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { courseId, courseFileId, courseFileKey } = req.query;

    Course.updateOne(
      { _id: courseId },
      { $pull: { files: { _id: courseFileId } } },
      function (err: any, numAffected: any) {
        if (err) {
          res.status(400).json(err);
        } else {
          s3DeleteHelper(courseFileKey as string);
          res.status(200).json("successful");
        }
      }
    );
  })
);

export default router;
