import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../src/utils/mysql.js";

/* TYPES */
export type User = {
  id: number;
  name: string;
  email: string;
  birthday: string;
  createdAt: string;
};

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  birthday: Date;
};

/* FIND BY EMAIL */
export const findUserByEmail = async (email: string) => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT 
      id, name, email, password, birthday, createdAt 
     FROM users 
     WHERE email = ?`,
    [email]
  );

  return rows.length > 0 ? rows[0] : null;
};

/* FIND BY ID */
export const findUserById = async (id: number) => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, name, email, birthday, createdAt FROM users WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

/* INSERT USER */
export const insertUser = async (user: CreateUserData): Promise<User> => {
  // ✅ formata a data para MySQL (YYYY-MM-DD)
  const birthdayFormatted = user.birthday
    .toISOString()
    .split("T")[0];

  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, password, birthday)
     VALUES (?, ?, ?, ?)`,
    [
      user.name,
      user.email,
      user.password,
      birthdayFormatted,
    ]
  );

  const insertedId = result.insertId;

  // 🔥 busca o usuário recém criado
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT 
      id, name, email, birthday, createdAt 
     FROM users 
     WHERE id = ?`,
    [insertedId]
  );

  const created = rows[0];

  if (!created) {
    throw new Error("Erro ao buscar usuário criado.");
  }

  return {
    id: created.id,
    name: created.name,
    email: created.email,
    birthday: created.birthday,
    createdAt: created.createdAt,
  };
};

/* FIND ALL */
export const findAllUsers = async (): Promise<User[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT 
      id, name, email, birthday, createdAt 
     FROM users 
     ORDER BY createdAt DESC`
  );

  return rows as User[];
};

/* DELETE */
export const deleteUserById = async (id: number): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>(
    "DELETE FROM users WHERE id = ?",
    [id]
  );

  return result.affectedRows;
};