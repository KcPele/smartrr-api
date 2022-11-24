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
    await Video.updateOne({ _id: id }, { $inc: { views: 1 } }, { new: true });
    res.status(200).json({ videos });
  }
);

interface MulterFile extends Express.Multer.File {
  location: String;
  key: String;
}

const createVideo = async (req: express.Request, res: express.Response) => {
  const { title, category, description } = req.body;

  if (!req.files) return res.status(400).json({ error: "no file selected" });
  let files = req.files as any;
  if (!files.thumbnail)
    return res.status(400).json({ error: "no thumbnail selected" });
  if (!files.video) return res.status(400).json({ error: "no video selected" });

  let videoKey = files.video[0].key;
  let videoUrl = files.video[0].location;
  let videoName = files.video[0].originalname;
  let thumbnailKey = files.thumbnail[0].key;
  let thumbnailUrl = files.thumbnail[0].location;
  let thumbnailName = files.thumbnail[0].originalname;

  try {
    const owner = await User.findById(req.userId);
    const video = await Video.create({
      title,
      videoKey,
      videoName,
      videoUrl,
      views: 0,
      rating: 0,
      thumbnailKey,
      thumbnailName,
      thumbnailUrl,
      description,
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
    const { title, rating, category, description } = req.body;
    const update = {
      title,
      rating,
      category,
      description,
    } as unknown as IVideo;
    if (req.files) {
      let files = req.files as any;
      if (files?.thumbnail) {
        let video = await Video.findById(id);
        s3DeleteHelper(video?.thumbnailKey as string);
        update.thumbnailKey = files.thumbnail[0].key as string;
        update.thumbnailUrl = files.thumbnail[0].location as string;
        update.thumbnailName = files.thumbnail[0].originalname as string;
      }
      if (files?.video) {
        let video = await Video.findById(id);
        s3DeleteHelper(video?.videoKey as string);
        update.videoKey = files.video[0].key as string;
        update.videoUrl = files.video[0].location as string;
        update.videoName = files.video[0].originalname as string;
      }
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
        s3DeleteHelper(video?.videoKey as string);
        s3DeleteHelper(video?.thumbnailKey as string);
        res.status(200).json(video);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

export { getAllVideo, getVideo, createVideo, updateVideo, deleteVideo };
