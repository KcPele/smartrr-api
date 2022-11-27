import { Schema, model, InferSchemaType } from "mongoose";
const videoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    thumbnail: {
      key: { type: String, required: true },
      url: { type: String, required: true },
      name: { type: String },
    },
    video: {
      key: { type: String, required: true },
      url: { type: String, required: true },
      name: { type: String },
    },

    views: { type: Number },
    rating: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: "Category" },

    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export type IVideo = InferSchemaType<typeof videoSchema>;

export default model<IVideo>("Video", videoSchema);
