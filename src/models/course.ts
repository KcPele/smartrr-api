import { Schema, model, InferSchemaType } from "mongoose";
const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    downloads: [{ type: String }],
    files: [
      {
        key: { type: String, required: true },
        url: { type: String, required: true },
        name: { type: String },
      },
    ],
    is_active: { type: Boolean, required: true, default: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export type ICourse = InferSchemaType<typeof courseSchema>;

export default model<ICourse>("course", courseSchema);
