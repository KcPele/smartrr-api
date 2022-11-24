import express from "express";

import User from "../modals/user";
import asyncHandler from "express-async-handler";

import Video, { IVideo } from "../modals/video";
import { s3DeleteHelper } from "../middleware";

const getAllVideo = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let videos = await Video.find().populate("category");

    res.status(200).json({ videos });
  }
);
const getVideo = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id } = req.query;
    let videos = await Video.findById(id).populate("category");
    await Video.updateOne({ _id: id }, { $inc: { play: 1 } }, { new: true });
    res.status(200).json({ videos });
  }
);

interface MulterFile extends Express.Multer.File {
  location: String;
  key: String;
}

const createVideo = async (req: express.Request, res: express.Response) => {
  const { title, category } = req.body;
  // let category = await Category.findById(categoryId);
  if (!req.file) return res.status(400).json({ error: "no file selected" });
  let file = req.file as MulterFile;
  let key = file.key;
  let url = file.location;
  let imgName = file.originalname;

  try {
    const owner = await User.findById(req.userId);
    const video = await Video.create({
      title,
      key,
      play: 0,
      rating: 0,
      url,
      imgName,
      category,
      owner,
    });
    res.status(200).json(video);
  } catch (err: any) {
    res.status(500).json({ error: err.message as Error });
  }
};

const updateVideo = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id } = req.query;
    const { title, rating, category } = req.body;
    const update = { title, rating, category } as unknown as IVideo;
    if (req.file) {
      let video = await Video.findById(id);
      s3DeleteHelper(video?.key as string);
      let file = req.file as MulterFile;
      update.key = file.key as string;
      update.url = file.location as string;
      update.imgName = file.originalname as string;
    }

    let query = { _id: id, owner: req.userId };
    let video = await Video.findOneAndUpdate(query, update, {
      new: true,
    });
    res.status(200).json(video);
  }
);

const deleteVideo = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id } = req.query;
    let query = { _id: id, owner: req.userId };
    Video.findOneAndDelete(query)
      .then((video) => {
        s3DeleteHelper(video?.key as string);
        res.status(200).json(video);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

export { getAllVideo, getVideo, createVideo, updateVideo, deleteVideo };
