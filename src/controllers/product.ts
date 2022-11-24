import express from "express";
import mongoose, { Types } from "mongoose";
import User from "../modals/user";
import asyncHandler from "express-async-handler";

import Product, { IProduct } from "../modals/product";
import { s3DeleteHelper } from "../middleware";

const getAllProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let products = (await Product.find({})) as [IProduct?];
    res.status(200).json({ products });
  }
);

const getProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let product = (await Product.findById(req.params?.productId)) as IProduct;
    res.status(200).json({ product });
  }
);



const createProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { name, price, description } = req.body;
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
    try {
      const owner = await User.findById(req.userId);
      const product = await Product.create({
        name,
        price,
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
    const { id } = req.query;
    const { name, price, description } = req.body;
    const update = { name, price, description } as unknown as IProduct;
    if (req.files) {
      let product = await Product.findById(id);
      let imgLength = product?.imgUrl.length as Number;
      if (imgLength > 5)
        res.status(400).json({ error: "Cannot upload more than 5 images" });
      let files = req.files as any[];
      files.map((image) => {
        product?.imgUrl.push({
          key: image.key,
          url: image.location,
          imgName: image.originalname,
        });
      });
      product?.save();
    }

    let query = { _id: id, owner: req.userId };
    let product = await Product.findOneAndUpdate(query, update, {
      new: true,
    });
    res.status(200).json(product);
  }
);

const deleteProduct = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id } = req.query;

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

const deleteProductImage = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { productId, imgKey, imgId } = req.query;

    Product.updateOne(
      { _id: productId },
      { $pull: { imgUrl: { _id: imgId } } },
      function (err: any, numAffected: any) {
        if (err) {
          console.log(err);
          res.status(400).json(err);
        } else {
          s3DeleteHelper(imgKey as string);
          res.status(200).json("successful");
        }
      }
    );
  }
);

export {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
};
