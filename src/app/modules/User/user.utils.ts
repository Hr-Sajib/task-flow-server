import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayLoad: { email: string; userRole: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayLoad, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};