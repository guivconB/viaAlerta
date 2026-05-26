import express from "express";
import {
  createPostController,
  listFeedController,
} from "./postController.js";

import { authMiddleware } from "../../src/middlewares/auth.js";

const router = express.Router();

/* CREATE POST (protegido) */
router.post("/", authMiddleware, createPostController);

/* LIST FEED (público) */
router.get("/", listFeedController);

export default router;