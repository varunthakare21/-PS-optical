import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
      return;
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-change-in-prod');
    const user = await User.findById(decoded.id).select('-passwordHash -resetToken -resetTokenExpiry');
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found.' });
      return;
    }
    if (user.accountStatus !== 'active') {
      res.status(403).json({ success: false, message: 'Account is not active.' });
      return;
    }
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Token expired.' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid token.' });
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Insufficient permissions.' });
      return;
    }
    next();
  };
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-change-in-prod');
      const user = await User.findById(decoded.id).select('-passwordHash -resetToken -resetTokenExpiry');
      if (user && user.accountStatus === 'active') {
        req.user = user;
      }
    }
  } catch {}
  next();
};
