import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        error: "Token de acesso não fornecido",
      });
      return;
    }

    // Verificar se JWT_SECRET está definido
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        error: "Configuração do servidor incompleta",
      });
      return;
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Adicionar informações do usuário à requisição
    req.user = decoded;
    
    next();  } catch {
    res.status(401).json({
      error: "Token inválido ou expirado",
    });
    return;
  }
};

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Verificar se o usuário está autenticado
    if (!req.user) {
      res.status(401).json({
        error: "Usuário não autenticado",
      });
      return;
    }

    // Verificar se o usuário tem role de admin
    if (req.user.role !== "admin") {
      res.status(403).json({
        error: "Acesso negado. Apenas administradores podem acessar este recurso",
      });
      return;
    }

    next();  } catch {
    res.status(500).json({
      error: "Erro interno do servidor",
    });
    return;
  }
};
