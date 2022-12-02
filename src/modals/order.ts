import { Schema, model, InferSchemaType } from "mongoose";
const orderSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    paymentRef: { type: String, required: true },

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