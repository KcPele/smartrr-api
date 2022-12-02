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

const updateCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    const update = { name } as unknown as ICategory;

    let query = { _id: categoryId };
    let category = await Category.findOneAndUpdate(query, update, {
      new: true,
    });
    res.status(200).json(category);
  }
);

const deleteCategory = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { categoryId } = req.params;
    let query = { _id: categoryId };
    Category.findOneAndDelete(query)
      .then((category) => {
        res.status(200).json(category);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

export { getAllCategory, createCategory, deleteCategory, updateCategory };
