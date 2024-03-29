import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import productRoutes from "./routes/products";
import videoRoutes from "./routes/video";
import categoryRoute from "./routes/category";
import imageDeleteRoute from "./routes/deleteImage";
import productItemRoute from "./routes/deleteProductItems";
import orderRoute from "./routes/order";
import webhookRoute from "./routes/webhook";

dotenv.config();

declare global {
  export namespace Express {
    interface Request {
      userId: string;
    }
  }
}

mongoose
  .connect(process.env.MONGODB_URL as string)
  .then((val) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.connection.on("connecting", function () {
  console.log("connecting to MongoDB...");
});

mongoose.connection.on("error", function (error) {
  console.error("Error in MongoDb connection: " + error);
  mongoose.disconnect();
});
mongoose.connection.on("connected", function () {
  console.log("MongoDB connected!");
});
mongoose.connection.once("open", function () {
  console.log("MongoDB connection opened!");
});
mongoose.connection.on("reconnected", function () {
  console.log("MongoDB reconnected!");
});

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();
app.use(helmet());
app.use(cors());

app.use(express.json());

app.use("/user", userRoutes);
app.use("/orders", orderRoute);
app.use("/videos", videoRoutes);
app.use("/courses", courseRoutes);
app.use("/products", productRoutes);
app.use("/remove", imageDeleteRoute);
app.use("/categories", categoryRoute);
app.use("/remove-item", productItemRoute);
app.use("/webhooks", webhookRoute);
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
