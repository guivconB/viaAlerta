import { createUser, listUsers, deleteUser, loginUser } from './userService.js';
import { findUserByEmail } from './userModel.js';
import { findUserById } from './userModel.js';
import type { Request, Response } from "express";

/* CREATE */
export const createUserController = async (req: Request, res: Response) => {
  try {
    const newUser = await createUser(req.body);

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Falha ao cadastrar usuário.",
    });
  }
};

/* LOGIN */
export const loginUserController = async (req: Request, res: Response) => {
  try {
    const authResult = await loginUser(req.body);

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token: authResult.token,
      user: authResult.user,
    });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Falha ao autenticar usuário.",
    });
  }
};

/* GET ME */
export const getMeController = async (req: any, res: Response) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
};

/* LIST */
export const listUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await listUsers();

    return res.status(200).json({ users });
  } catch {
    return res.status(500).json({
      error: "Falha ao buscar usuários.",
    });
  }
};

/* DELETE */
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // validação básica
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "ID de usuário inválido." });
    }

    // 🔥 converter string → number
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ error: "ID deve ser numérico." });
    }

    await deleteUser(idNumber);

    return res.status(200).json({
      message: "Usuário excluído com sucesso.",
    });

  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Falha ao excluir usuário.",
    });
  }
};