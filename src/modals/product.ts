import { Schema, model, InferSchemaType } from "mongoose";
const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  imgUrl: [
    {
      key: { type: String, required: true },
      url: { type: String, required: true },
      imgName: { type: String },
    },
  ],
  desc: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

export type IProduct = InferSchemaType<typeof productSchema>;

export default model<IProduct>("Product", productSchema);
