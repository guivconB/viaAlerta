import { createPost, getFeed, toggleUpvote, toggleResolved, type CreatePostData } from "./postModel.js";

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