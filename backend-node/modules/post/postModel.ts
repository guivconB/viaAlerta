import { db } from "../../src/utils/mysql.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export type CreatePostData = {
  userId: number;
  content: string;
  problemType: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
};

export const createPost = async (data: CreatePostData) => {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO posts (userId, content, problemType, location, latitude, longitude, imageUrl) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.userId, 
      data.content, 
      data.problemType || 'OUTRO', 
      data.location || '', 
      data.latitude || null, 
      data.longitude || null, 
      data.imageUrl || null
    ]
  );
  return result.insertId;
};

export const getFeed = async (currentUserId?: number) => {
  const [rows] = await db.execute<RowDataPacket[]>(`
    SELECT 
      posts.id,
      posts.content as \`desc\`,
      posts.problemType as type,
      posts.location,
      posts.latitude,
      posts.longitude,
      posts.imageUrl,
      posts.upvotes,
      posts.resolvedVotes,
      posts.createdAt as time,
      users.name as author
    FROM posts
    JOIN users ON users.id = posts.userId
    ORDER BY posts.createdAt DESC
  `);

  if (!currentUserId) return rows;

  // Se tem usuário logado, vamos buscar os votos dele para preencher votedByMe e resolvedByMe
  const [upvotes] = await db.execute<RowDataPacket[]>(
    'SELECT postId FROM post_upvotes WHERE userId = ?', [currentUserId]
  );
  const [resolved] = await db.execute<RowDataPacket[]>(
    'SELECT postId FROM post_resolved WHERE userId = ?', [currentUserId]
  );

  const upvotedIds = new Set(upvotes.map(v => v.postId));
  const resolvedIds = new Set(resolved.map(v => v.postId));

  return rows.map(row => ({
    ...row,
    votedByMe: upvotedIds.has(row.id),
    resolvedByMe: resolvedIds.has(row.id)
  }));
};

export const toggleUpvote = async (postId: number, userId: number) => {
  const [existing] = await db.execute<RowDataPacket[]>(
    'SELECT 1 FROM post_upvotes WHERE postId = ? AND userId = ?', [postId, userId]
  );

  if (existing.length > 0) {
    await db.execute('DELETE FROM post_upvotes WHERE postId = ? AND userId = ?', [postId, userId]);
    await db.execute('UPDATE posts SET upvotes = upvotes - 1 WHERE id = ?', [postId]);
    return { votedByMe: false };
  } else {
    await db.execute('INSERT INTO post_upvotes (postId, userId) VALUES (?, ?)', [postId, userId]);
    await db.execute('UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?', [postId]);
    return { votedByMe: true };
  }
};

export const toggleResolved = async (postId: number, userId: number) => {
  const [existing] = await db.execute<RowDataPacket[]>(
    'SELECT 1 FROM post_resolved WHERE postId = ? AND userId = ?', [postId, userId]
  );

  if (existing.length > 0) {
    await db.execute('DELETE FROM post_resolved WHERE postId = ? AND userId = ?', [postId, userId]);
    await db.execute('UPDATE posts SET resolvedVotes = resolvedVotes - 1 WHERE id = ?', [postId]);
    return { resolvedByMe: false };
  } else {
    await db.execute('INSERT INTO post_resolved (postId, userId) VALUES (?, ?)', [postId, userId]);
    await db.execute('UPDATE posts SET resolvedVotes = resolvedVotes + 1 WHERE id = ?', [postId]);
    return { resolvedByMe: true };
  }
};