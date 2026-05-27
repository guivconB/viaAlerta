import type { Request, Response } from "express";
import { insertTest, getUserTests } from "./testModel.js";

// Extend Request to type the user attached by middleware
interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const createTestResult = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Não autorizado" });
      return;
    }

    const { testType, score, status } = req.body;
    
    if (!testType || score === undefined || !status) {
      res.status(400).json({ error: "Faltam dados do teste" });
      return;
    }

    const id = await insertTest({ userId, testType, score, status });
    res.status(201).json({ success: true, testId: id });
  } catch (error) {
    console.error("Erro ao salvar teste:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Não autorizado" });
      return;
    }

    const tests = await getUserTests(userId);
    res.json({ history: tests });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
