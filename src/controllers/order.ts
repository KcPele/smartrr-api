import express from "express";

import asyncHandler from "express-async-handler";

import Order, { IOrder } from "../models/order";

const getAllOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let searchQuery: any = {};

    if (req.query.userId) {
      searchQuery.userId = req.query.userId;
    }
    let orders = await Order.find(searchQuery);

    res.status(200).json({ orders });
  }
);

const getAnOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let order = (await Order.findById(req.params?.orderId)) as [IOrder?];
    res.status(200).json({ order });
  }
);

const updateOrder = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const update = {
      status,
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

export { getAllOrder, getAnOrder, deleteOrder, updateOrder };
