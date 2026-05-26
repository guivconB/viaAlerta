import bcrypt from "bcryptjs";
import { generateToken } from "../../src/utils/jwt.js";

import type { CreateUserData, User } from "./userModel.js";
import {
  findUserByEmail,
  insertUser,
  findAllUsers,
  deleteUserById,
} from "./userModel.js";

export type LoginUserData = {
  email: string;
  password: string;
};

export type AuthResult = {
  token: string;
  user: User;
};

/**
 * Criação de usuário
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const { email, password, birthday, name } = userData;

  // validação básica
  if (!email || !password || !name || !birthday) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  // verifica duplicidade
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("E-mail já registrado.");
  }

  // hash da senha
  const passwordHash = await bcrypt.hash(password, 10);

  // validação de data
  const birthdayDate = new Date(birthday);
  if (isNaN(birthdayDate.getTime())) {
    throw new Error("Data de nascimento inválida.");
  }

  // criação no banco (id vem do MySQL)
  return await insertUser({
    name,
    email,
    password: passwordHash,
    birthday: birthdayDate,
  });
};




/**
 * Listagem de usuários
 */
export const loginUser = async (loginData: LoginUserData): Promise<AuthResult> => {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new Error("Preencha email e senha para fazer login.");
  }

  const existingUser = await findUserByEmail(email);
  if (!existingUser) {
    throw new Error("E-mail ou senha inválidos.");
  }

  const passwordMatches = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatches) {
    throw new Error("E-mail ou senha inválidos.");
  }

  const token = generateToken(String(existingUser.id));

  const user: User = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    birthday: existingUser.birthday,
    createdAt: existingUser.createdAt,
  };

  return { token, user };
};

export const listUsers = async (): Promise<User[]> => {
  return await findAllUsers();
};

/**
 * Remoção de usuário
 */
export const deleteUser = async (id: number): Promise<void> => {
  if (!id || isNaN(id)) {
    throw new Error("ID inválido.");
  }

  const deletedRows = await deleteUserById(id);

  if (deletedRows === 0) {
    throw new Error("Usuário não encontrado.");
  }
};