import { createPost, getFeed } from "./postModel.js";

/* CREATE POST */
export const createPostService = async (
  userId: number,
  content: string
): Promise<void> => {

  if (!content || content.trim() === "") {
    throw new Error("Conteúdo do post é obrigatório.");
  }

  await createPost(userId, content);
};

/* LIST FEED */
export const listFeedService = async () => {
  return await getFeed();
};