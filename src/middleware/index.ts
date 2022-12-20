import * as dotenv from "dotenv";
dotenv.config();
import aws from "aws-sdk";
import multer from "multer";
import { Request, NextFunction, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import User from "../models/user";

export const s3Config = new S3Client({
  region: process.env.S3_BUCKET_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_ACCESS_SECRET as string,
  },
});

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY as string,
  secretAccessKey: process.env.S3_ACCESS_SECRET as string,
  region: process.env.S3_BUCKET_REGION as string,
});

export const s3DeleteHelper = (key: string) => {
  s3.deleteObject(
    {
      Bucket: process.env.S3_BUCKET as string,
      Key: key,
    },
    (err, data) => {
      if (err) {
        console.error("err", err);
      }
    }
  );
};

export const uploadVideo = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.S3_BUCKET as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, "videos/" + Date.now().toString() + "-" + file.originalname);
    },
  }),
});

export const upload = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.S3_BUCKET as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, "images/" + Date.now().toString() + "-" + file.originalname);
    },
  }),
});
export interface IRequest extends Request {
  userId: any;
}

export const tokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1] as string;
  try {
    const userId = jwt.verify(
      token,
      process.env.PRIVATE_KEY as string
    ) as jwt.JwtPayload;
    let user = await User.findById(userId?._id);
    if (!user) {
      res.status(400).json({ error: "wrong credentials" });
    } else {
      req.userId = userId._id;
      next();
    }
  } catch (error: any) {
    // console.log(error)
    let errors = error as JsonWebTokenError;
    res.status(500).json({ error: errors.message });
  }
};

export const orderTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1] as string;
  try {
    const val = jwt.verify(
      token,
      process.env.PRIVATE_KEY as string
    ) as jwt.JwtPayload;

    if (
      val?.orderKey?.toString() !== (process.env.ORDER_PRIVATE_KEY as string)
    ) {
      res.status(400).json({ error: "not a valid token" });
    } else {
      next();
    }
  } catch (error: any) {
    // console.log(error)
    let errors = error as JsonWebTokenError;
    res.status(500).json({ error: errors.message });
  }
};
