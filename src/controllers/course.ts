import express from "express";
import mongoose, { MongooseError, Types } from "mongoose";
import User from "../models/user";
import asyncHandler from "express-async-handler";

import Course, { ICourse } from "../models/course";
import { s3DeleteHelper } from "../middleware";

const getAllCourses = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let courses = await Course.find({}).sort({ updatedAt: -1 });
    res.status(200).json({ courses });
  }
);

const getCourse = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let course = (await Course.findById(req.params?.courseId)) as ICourse;
    res.status(200).json({ course });
  }
);

const createCourse = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let { title, author, userId, is_active } = req.body;

    let courseFileUrls = [];
    if (req.files) {
      let files = req.files as any[];
      courseFileUrls = files?.reduce(
        (acc, file) => [
          ...acc,
          { key: file.key, url: file.location, name: file.originalname },
        ],
        []
      );
    }
    let downloads = [];
    downloads.push(userId);

    try {
      const owner = await User.findById(req.userId);
      const course = await Course.create({
        title,
        author,
        downloads,
        files: courseFileUrls,
        is_active,
        owner,
      });
      res.status(200).json(course);
    } catch (err: any) {
      res.status(500).json({ error: err.message as Error });
    }
  }
);

const updateCourse = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let id = req.params?.courseId;
    let { title, author, userId, is_active } = req.body;
    const update = {
      title,
      author,
      is_active,
    } as any;
    update.$push = { downloads: userId };

    let courseUpdate = await Course.findById(id);

    if (req.files) {
      let fileLength = courseUpdate?.files.length as number;
      if (fileLength > 3)
        res.status(400).json({ error: "Cannot upload more than 3 files" });
      let files = req.files as any[];
      files.map((file) => {
        courseUpdate?.files.push({
          key: file.key,
          url: file.location,
          name: file.originalname,
        });
      });
    }
    courseUpdate?.save();

    let query = { _id: id, owner: req.userId };
    let course = await Course.findOneAndUpdate(query, update, {
      new: true,
    });
    res.status(200).json(course);
  }
);

const deleteCourse = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let id = req.params?.courseId;

    let query = { _id: id, owner: req.userId };
    Course.findOneAndDelete(query)
      .then((course) => {
        course?.files.map((file) => {
          s3DeleteHelper(file.key);
        });
        res.status(200).json(course);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

export { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse };
