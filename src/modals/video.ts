import { Schema, model, InferSchemaType } from "mongoose";
const videoSchema = new Schema({
  title: { type: String, required: true },

  key: { type: String, required: true },
  url: { type: String, required: true },

  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

export type IVideo = InferSchemaType<typeof videoSchema>;

export default model<IVideo>("Video", videoSchema);
