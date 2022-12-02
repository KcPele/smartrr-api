import express from "express";

import User from "../modals/user";
import asyncHandler from "express-async-handler";

import Order, { IOrder } from "../modals/order";

const getAllOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let orders = (await Order.find({})) as [IOrder?];
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
    const { name, userId, email, paymentRef, status, phoneNumber } = req.body;
    try {
      const order = await Order.create({
        name,
        userId,
        email,
        paymentRef,
        status,
        phoneNumber,
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
    const { name, userId, email, paymentRef, status, phoneNumber } = req.body;
    const update = {
      name,
      userId,
      email,
      paymentRef,
      status,
      phoneNumber,
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
