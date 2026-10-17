import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string, expiresIn = '7d'): string => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'fallback-secret-change-in-prod',
    { expiresIn } as jwt.SignOptions
  );
};

export const generateResetToken = (): { token: string; hash: string } => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `PSO-${timestamp}-${random}`;
};

export const setCookieToken = (res: any, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearCookieToken = (res: any): void => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
  });
};

export const paginateResults = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

export const createPaginationMeta = (total: number, page: number, limit: number) => {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
};
