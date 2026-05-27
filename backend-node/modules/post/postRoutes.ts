import express from "express";
import {
  createPostController,
  listFeedController,
  toggleUpvoteController,
  toggleResolvedController
} from "./postController.js";

import { authMiddleware } from "../../src/middlewares/auth.js";

// Optional auth middleware so listFeed can extract user ID if logged in, but not block if not
const optionalAuth = (req: any, res: any, next: any) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
};

const router = express.Router();

/* CREATE POST (protegido) */
router.post("/", authMiddleware, createPostController);

/* LIST FEED (público, mas tenta ler token se tiver) */
router.get("/", optionalAuth, listFeedController);

/* VOTAR (protegido) */
router.post("/:id/upvote", authMiddleware, toggleUpvoteController);
router.post("/:id/resolve", authMiddleware, toggleResolvedController);

export default router;