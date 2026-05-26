import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

// 🔹 Tipagem do payload do token
type TokenPayload = {
  id: string;
  email?: string;
};

type AuthRequest = Request & {
  user?: {
    id: number;
  };
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do Token' });
  }

  const [scheme, token] = parts as [string, string];

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  try {
    const decoded = verifyToken(token) as TokenPayload;

    // 🔥 GARANTE number
    req.user = {
      id: Number(decoded.id),
    };

    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};