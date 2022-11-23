import { Schema, model, InferSchemaType } from "mongoose";
const categorySchema = new Schema({
  name: { type: String, required: true },
  // owner: { type: Schema.Types.ObjectId, ref: "User" },
});

export type ICategory = InferSchemaType<typeof categorySchema>;

export default model<ICategory>("Category", categorySchema);
