import express from "express";
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course";
import { tokenMiddleware, uploadCourse } from "../middleware";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:courseId", getCourse);
router.post("/", tokenMiddleware, uploadCourse.array("file", 3), createCourse);

router.put(
  "/:courseId",
  tokenMiddleware,
  uploadCourse.array("file", 3),
  updateCourse
);

router.delete("/:courseId", tokenMiddleware, deleteCourse);

export default router;
