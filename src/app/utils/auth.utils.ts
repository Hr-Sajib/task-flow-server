import jwt, { JwtPayload } from "jsonwebtoken";

// Create a JWT token
export const createToken = (
  payload: { userEmail: string; role: string },
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

// Verify a JWT token
export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};