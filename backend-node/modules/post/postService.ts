import { createPost, getFeed, toggleUpvote, toggleResolved, deletePostById, type CreatePostData } from "./postModel.js";
import { findUserById } from "../user/userModel.js";

/* CREATE POST */
export const createPostService = async (data: CreatePostData): Promise<void> => {
  if (!data.content || data.content.trim() === "") {
    throw new Error("Conteúdo do post é obrigatório.");
  }
  await createPost(data);
};

/* LIST FEED */
export const listFeedService = async (currentUserId?: number) => {
  return await getFeed(currentUserId);
};

/* TOGGLE UPVOTE */
export const toggleUpvoteService = async (postId: number, userId: number) => {
  return await toggleUpvote(postId, userId);
};

/* TOGGLE RESOLVED */
export const toggleResolvedService = async (postId: number, userId: number) => {
  return await toggleResolved(postId, userId);
};

/* DELETE POST */
export const deletePostService = async (postId: number) => {
  await deletePostById(postId);
};

/* DELETE POST */
export const deletePostService = async (postId: number, userId: number) => {
  const user = await findUserById(userId);
  if (!user || user.role !== 'ADMIN') {
    throw new Error("Ação não permitida. Apenas administradores podem excluir posts.");
  }
  await deletePostById(postId);
};