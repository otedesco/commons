import {
  sign as JWTSign,
  SignOptions,
  verify as JWTVerify,
} from "jsonwebtoken";

export function sign(
  payload: object,
  secretKey: string,
  options?: SignOptions,
): string | null {
  try {
    const key = Buffer.from(secretKey, "base64").toString("ascii");

    return JWTSign(payload, key, {
      ...(options && options),
      algorithm: "RS256",
    });
  } catch (err) {
    return null;
  }
}

export function verify<T>(token: string | null, publicKey: string): T | null {
  if (!token) return null;

  try {
    const key = Buffer.from(publicKey, "base64").toString("ascii");

    return JWTVerify(token, key) as T;
  } catch (error) {
    return null;
  }
}
