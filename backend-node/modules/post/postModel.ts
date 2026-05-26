import { db } from "../../src/utils/mysql.js";

export const createPost = async (userId: number, content: string) => {
  await db.execute(
    "INSERT INTO posts (userId, content) VALUES (?, ?)",
    [userId, content]
  );
};

export const getFeed = async () => {
  const [rows] = await db.execute(`
    SELECT 
      posts.id,
      posts.content,
      posts.createdAt,
      users.name as author
    FROM posts
    JOIN users ON users.id = posts.userId
    ORDER BY posts.createdAt DESC
  `);

  return rows;
};