import express from "express";
import asyncHandler from "express-async-handler";

import User from "../modals/user";
const router = express.Router();

router.post(
  "/login",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const user = await User.loginUser(req.body.email, req.body.password);
    res.status(200).json(user);
  })
);
router.post(
  "/register",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be up to 6 characters" });
    } else {
      const user = await User.createNewUser(email, password);
      res.status(200).json(user);
    }
  })
);
export default router;
