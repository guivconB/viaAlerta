import { createPostService, listFeedService } from './postService.js';
import type { Request, Response } from 'express';

type RequestWithUser = Request & {
  user?: {
    id: number;
  };
};

/* CREATE POST */
export const createPostController = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const { content } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        error: "Conteúdo do post é obrigatório"
      });
    }

    const userId = Number(req.user.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: "ID do usuário inválido"
      });
    }

    //  cria post
    await createPostService(userId, content);

    return res.status(201).json({
      message: "Post criado com sucesso"
    });

  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error
        ? error.message
        : "Erro interno ao criar post"
    });
  }
};

/* LIST FEED */
export const listFeedController = async (_req: Request, res: Response) => {
  try {
    const feed = await listFeedService();

    return res.status(200).json({
      feed
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar feed"
    });
  }
};