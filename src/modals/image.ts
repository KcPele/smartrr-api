import { Schema, model, InferSchemaType } from "mongoose";
const imageSchema = new Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
});

export type IImage = InferSchemaType<typeof imageSchema>;

export default model<IImage>("Image", imageSchema);
