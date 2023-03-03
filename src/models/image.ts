import { Schema, model, InferSchemaType } from "mongoose";
const imageSchema = new Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
  imgName: { type: String },
});

export type IImage = InferSchemaType<typeof imageSchema>;

export default model<IImage>("Image", imageSchema);
