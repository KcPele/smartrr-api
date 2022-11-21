import express from "express";

import User from "../modals/user";
import asyncHandler from "express-async-handler";

import Video, { IVideo } from "../modals/video";
import { s3DeleteHelper } from "../middleware";

const getAllVideo = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let videos = (await Video.find({})) as [IVideo?];
    res.status(200).json({ videos });
  }
);

interface MulterFile extends Express.Multer.File {
  location: String;
  key: String;
}

const createVideo = async (req: express.Request, res: express.Response) => {
  const { title } = req.body;
  if (!req.file) return res.status(400).json({ error: "no file selected" });
  let file = req.file as MulterFile;
  let key = file.key;
  let url = file.location;
  try {
    const owner = await User.findById(req.userId);
    const video = await Video.create({
      title,
      key,
      url,
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
    const { title } = req.body;
    const update = { title } as unknown as IVideo;
    if (req.file) {
      let video = await Video.findById(id);
      s3DeleteHelper(video?.key as string);
      let file = req.file as MulterFile;
      update.key = file.key as string;
      update.url = file.location as string;
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

export { getAllVideo, createVideo, updateVideo, deleteVideo };
