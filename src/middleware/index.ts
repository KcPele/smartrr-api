// import * as dotenv from "dotenv";
// dotenv.config();
import aws from "aws-sdk";
import multer from "multer";
import { Request, NextFunction, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import User from "../modals/user";

export const s3Config = new S3Client({
  region: "us-west-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_ACCESS_SECRET as string,
  },
});

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY as string,
  secretAccessKey: process.env.S3_ACCESS_SECRET as string,
  region: "us-west-1",
});

export const s3DeleteHelper = (key: string) => {
  s3.deleteObject(
    {
      Bucket: process.env.s3_BUCKET as string,
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
    bucket: "mini-test-dashboard",
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
    bucket: "mini-test-dashboard",
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
    let user = await User.findById(userId._id);
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
