/* eslint-disable no-unused-vars */
// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { MongoClient } from '../database/mongo';
import { User } from '../models/user';
import { unauthorized } from '../controllers/helpers';

// Estende a interface Request do Express para incluir a propriedade 'user'
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

interface TokenPayload {
  id: string;
  // ... outros campos que você colocou no token
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    // Usar return para parar a execução
    return unauthorized('No authorization header provided.');
  }

  // O formato do token é "Bearer SEU_TOKEN_AQUI"
  const [, token] = authorization.split(' ');

  try {
    // Verifica a validade do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const { id } = decoded as TokenPayload;

    // Busca o usuário no banco para garantir que ele ainda existe
    const user = await MongoClient.db.collection<User>('users').findOne({
      _id: new ObjectId(id),
      deletedAt: null // Garante que o usuário não foi "deletado"
    });

    if (!user) {
      return unauthorized('Invalid user.');
    }

    // Anexa o objeto 'user' completo na requisição para ser usado pelos controllers
    req.user = user;

    // Continua para a próxima função (o controller da rota)
    return next();

  } catch (error) {
    return unauthorized('Invalid token.');
  }
}
