import express from "express";
import mongoose, { MongooseError, Types } from "mongoose";
import User from "../modals/user";
import asyncHandler from "express-async-handler";

import Product, { IProduct } from "../modals/product";
import { s3DeleteHelper } from "../middleware";

const getAllProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let products = await Product.find({}).sort({ updatedAt: -1 });
    res.status(200).json({ products });
  }
);

const getProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let product = (await Product.findById(req.params?.productId)) as IProduct;
    res.status(200).json({ product });
  }
);

interface IItem {
  price: string;
  item: string;
  quantity: string;
  _id?: string;
}
const createProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let { name, price, productType, productItems, description } = req.body;

    let imgUrl = [];
    if (req.files) {
      let files = req.files as any[];
      imgUrl = files?.reduce(
        (acc, image) => [
          ...acc,
          { key: image.key, url: image.location, imgName: image.originalname },
        ],
        []
      );
    }
    let items: IItem[] = [];
    if (productItems) {
      let productItem = JSON.parse(productItems);

      productItem?.map((val: IItem) => {
        items.push({
          item: val.item,
          price: val.price,
          quantity: val.quantity,
        });
      });
    }
    try {
      const owner = await User.findById(req.userId);
      const product = await Product.create({
        name,
        price,
        productType,
        items,
        imgUrl,
        description,
        owner,
      });
      res.status(200).json(product);
    } catch (err: any) {
      res.status(500).json({ error: err.message as Error });
    }
  }
);

const updateProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let id = req.params?.productId;
    const { name, productItems, rating, price, description } = req.body;
    const update = {
      name,
      price,
      rating,
      description,
    } as unknown as IProduct;

    let productUpdate = await Product.findById(id);
    if (productItems) {
      let productItem = JSON.parse(productItems);
      let newItems = productItem.filter((item: IItem) => !item._id);
      let oldItems = productItem.filter((item: IItem) => item._id);

      if (oldItems) {
        oldItems.forEach(async (element: IItem) => {
          await Product.findOneAndUpdate(
            { _id: id, "items._id": element._id },
            {
              $set: {
                "items.$": element,
              },
            }
          );
        });
      }
      if (newItems) {
        newItems?.map((val: IItem) => {
          productUpdate?.items.push({
            item: val.item,
            price: val.price,
            quantity: val.quantity,
          });
        });
      }
    }

    if (req.files) {
      let imgLength = productUpdate?.imgUrl.length as Number;
      if (imgLength > 5)
        res.status(400).json({ error: "Cannot upload more than 5 images" });
      let files = req.files as any[];
      files.map((image) => {
        productUpdate?.imgUrl.push({
          key: image.key,
          url: image.location,
          imgName: image.originalname,
        });
      });
    }
    productUpdate?.save();

    let query = { _id: id, owner: req.userId };
    let product = await Product.findOneAndUpdate(query, update, {
      new: true,
    });
    res.status(200).json(product);
  }
);

const deleteProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let id = req.params?.productId;

    let query = { _id: id, owner: req.userId };
    Product.findOneAndDelete(query)
      .then((product) => {
        product?.imgUrl.map((val) => {
          s3DeleteHelper(val.key);
        });
        res.status(200).json(product);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

export {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
