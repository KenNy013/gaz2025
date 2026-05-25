import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.admin_token;
    if (!token) {
      res.status(401).json({ error: 'Не авторизован' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    (req as any).admin = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Недействительный токен' });
  }
};
