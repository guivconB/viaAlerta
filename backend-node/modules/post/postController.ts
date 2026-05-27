import { createPostService, listFeedService, toggleUpvoteService, toggleResolvedService } from './postService.js';
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

    const { content, problemType, location, latitude, longitude, imageUrl } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        error: "Conteúdo do post é obrigatório"
      });
    }

    const userId = Number(req.user.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID do usuário inválido" });
    }

    await createPostService({
      userId,
      content,
      problemType,
      location,
      latitude,
      longitude,
      imageUrl
    });

    return res.status(201).json({ message: "Post criado com sucesso" });

  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Erro interno ao criar post"
    });
  }
};

/* LIST FEED */
export const listFeedController = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.id ? Number(req.user.id) : undefined;
    const feed = await listFeedService(userId);

    return res.status(200).json({ feed });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar feed" });
  }
};

/* TOGGLE UPVOTE */
export const toggleUpvoteController = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Não autenticado" });
    
    const postId = Number(req.params.id);
    const userId = Number(req.user.id);
    
    const result = await toggleUpvoteService(postId, userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao registrar upvote" });
  }
};

/* TOGGLE RESOLVED */
export const toggleResolvedController = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Não autenticado" });
    
    const postId = Number(req.params.id);
    const userId = Number(req.user.id);
    
    const result = await toggleResolvedService(postId, userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao registrar status resolvido" });
  }
};