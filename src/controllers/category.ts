import express from "express";

import User from "../modals/user";
import asyncHandler from "express-async-handler";

import Category, { ICategory } from "../modals/category";

const getAllCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let categories = (await Category.find({})) as [ICategory?];
    res.status(200).json({ categories });
  }
);

const createCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { name } = req.body;
    try {
      const owner = await User.findById(req.userId);
      const category = await Category.create({
        name,
      });
      res.status(200).json(category);
    } catch (err: any) {
      res.status(500).json({ error: err.message as Error });
    }
  }
);

export { getAllCategory, createCategory };
