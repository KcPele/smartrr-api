import { Schema, model, InferSchemaType } from "mongoose";
const videoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  uploadTime: { type: String },
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

  // videoKey: { type: String, required: true },
  // videoName: { type: String, required: true },
  // videoUrl: { type: String, required: true },
  // thumbnailKey: { type: String, required: true },
  // thumbnailUrl: { type: String, required: true },
  // thumbnailName: { type: String, required: true },
  views: { type: Number },
  rating: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: "Category" },

  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

export type IVideo = InferSchemaType<typeof videoSchema>;

videoSchema.pre("save", function (next): void {
  this.uploadTime = Date.now().toString();
  next();
});

export default model<IVideo>("Video", videoSchema);
