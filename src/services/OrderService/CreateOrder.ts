import OrderModel, { IOrder } from "../../models/order";

export const CreateOrder = async (data: IOrder) => {
  const order = await OrderModel.create(data);

  return order;
};
