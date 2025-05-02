import express from "express";
import { createComment, getComments, deleteComment } from "../controller/comment.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { cache, cacheMiddleware, clearCache } from "../middleware/cache.js";

const router = express.Router();

router.post(
  "/create/:postId",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post_Comment"), next();
  },
  createComment
);

router.get(
  "/get/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("post_Comments", 600),
  getComments
);


router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post_Comments"), next();
  },
  deleteComment
);

export default router;
