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
    let id = req.params?.videoId;
    let videos = await Video.findById(id).populate("category");
    await Video.updateOne({ _id: id }, { $inc: { views: 1 } }, { new: true });
    res.status(200).json({ videos });
  }
);

const createVideo = async (req: express.Request, res: express.Response) => {
  const { title, category, description } = req.body;

  if (!req.files) return res.status(400).json({ error: "no file selected" });
  let files = req.files as any;
  if (!files.thumbnail)
    return res.status(400).json({ error: "no thumbnail selected" });
  if (!files.video) return res.status(400).json({ error: "no video selected" });

  let thumbnail = {
    key: files.thumbnail[0].key,
    url: files.thumbnail[0].location,
    name: files.thumbnail[0].originalname,
  };
  let vid = {
    key: files.video[0].key,
    url: files.video[0].location,
    name: files.video[0].originalname,
  };

  try {
    const owner = await User.findById(req.userId);
    const video = await Video.create({
      title,

      views: 0,
      rating: 0,
      video: vid,
      thumbnail,
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
        s3DeleteHelper(video?.thumbnail?.key as string);
        update.thumbnail.key = files.thumbnail[0].key as string;
        update.thumbnail.url = files.thumbnail[0].location as string;
        update.thumbnail.name = files.thumbnail[0].originalname as string;
      }
      if (files?.video) {
        let video = await Video.findById(id);
        s3DeleteHelper(video?.video?.key as string);
        update?.video?.key = files.video[0].key as string;
        update?.video?.url = files.video[0].location as string;
        update?.video?.name = files.video[0].originalname as string;
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
        s3DeleteHelper(video?.video?.key as string);
        s3DeleteHelper(video?.thumbnail?.key as string);
        res.status(200).json(video);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

export { getAllVideo, getVideo, createVideo, updateVideo, deleteVideo };
