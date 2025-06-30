/* eslint-disable no-unused-vars */
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
  id: ObjectId;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send('No authorization header provided.');
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const { id } = decoded as TokenPayload;

  const user = await MongoClient.db.collection<User>('users').findOne({
    _id: new ObjectId(id), // Converte a string 'id' de volta para um ObjectId
    deletedAt: null,
  });
  
    if (!user) {
      return res.status(401).send('Invalid user.');
    }

    req.user = {
      ...user,
      id: user._id,
    };
    return next();
  } catch (error) {
    return unauthorized('Invalid token.');
  }
}
