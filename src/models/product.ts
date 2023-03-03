import { Schema, model, InferSchemaType } from "mongoose";
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String },
    rating: { type: Number, default: 0 },
    productType: { type: String, required: true },
    items: [
      {
        item: { type: String },
        price: { type: String },
        quantity: { type: String },
      },
    ],
    imgUrl: [
      {
        key: { type: String, required: true },
        url: { type: String, required: true },
        imgName: { type: String },
      },
    ],
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export type IProduct = InferSchemaType<typeof productSchema>;

export default model<IProduct>("Product", productSchema);
