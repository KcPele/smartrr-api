import express from "express";

import User from "../modals/user";
import asyncHandler from "express-async-handler";

import Order, { IOrder } from "../modals/order";

import jwt from "jsonwebtoken";
const privateKey = process.env.PRIVATE_KEY;
const orderKey = process.env.ORDER_PRIVATE_KEY;

const getAllOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let orders = (await Order.find({})) as [IOrder?];
    // console.log(jwt.sign({ orderKey }, privateKey as string));
    res.status(200).json({ orders });
  }
);

const getAnOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let order = (await Order.findById(req.params?.orderId)) as [IOrder?];
    res.status(200).json({ order });
  }
);

const createOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const {
      name,
      userId,
      email,
      paymentRef,
      status,
      phoneNumber,
      state,
      localGovernmentArea,
      productId,
      productName,
      deliveryFee,
      totalAmount,
      address,
      majorLandmark,
    } = req.body;
    try {
      const order = await Order.create({
        name,
        userId,
        email,
        paymentRef,
        status,
        phoneNumber,
        state,
        localGovernmentArea,
        productId,
        productName,
        deliveryFee,
        totalAmount,
        address,
        majorLandmark,
      });
      res.status(200).json(order);
    } catch (err: any) {
      res.status(500).json({ error: err.message as Error });
    }
  }
);

const updateOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { orderId } = req.params;
    const {
      name,
      userId,
      email,
      paymentRef,
      status,
      phoneNumber,
      state,
      localGovernmentArea,
      productId,
      productName,
      deliveryFee,
      totalAmount,
      address,
      majorLandmark,
    } = req.body;
    const update = {
      name,
      userId,
      email,
      paymentRef,
      status,
      phoneNumber,
      state,
      localGovernmentArea,
      productId,
      productName,
      deliveryFee,
      totalAmount,
      address,
      majorLandmark,
    } as unknown as IOrder;

    let query = { _id: orderId };
    let order = await Order.findOneAndUpdate(query, update, {
      new: true,
    });
    res.status(200).json(order);
  }
);

const deleteOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { orderId } = req.params;
    let query = { _id: orderId };
    Order.findOneAndDelete(query)
      .then((order) => {
        res.status(200).json(order);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

export { getAllOrder, getAnOrder, createOrder, deleteOrder, updateOrder };
