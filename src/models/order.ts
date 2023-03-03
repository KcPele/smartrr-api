import { Schema, model, InferSchemaType } from "mongoose";
const orderSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    paymentRef: { type: String, required: true },
    state: { type: String, required: true },
    localGovernmentArea: { type: String, required: true },
    address: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    deliveryFee: { type: String, required: true },
    totalAmount: { type: String, required: true },
    majorLandmark: { type: String, required: true },
    status: {
      type: String,
      default: "processing",
      enum: ["processing", "shipped", "delivered"],
    },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export type IOrder = InferSchemaType<typeof orderSchema>;

export default model<IOrder>("Order", orderSchema);
