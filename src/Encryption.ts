import { compare, genSalt, hash } from "bcryptjs";

import { EncryptionError } from "./errors";
import { BaseException } from "./errors/BaseException";

function buildBaseError(
  code: string,
  message: string,
  data = {},
): BaseException {
  return new BaseException({
    status: 400,
    code,
    message,
    data,
  });
}

function validateResult<T>(result: T): void {
  if (!result) {
    throw buildBaseError(EncryptionError.code, EncryptionError.message);
  }
}

async function encryptionHandler<T>(promise: Promise<T>): Promise<T> {
  const result: T = await promise;
  validateResult(result);

  return result;
}

export async function generateSalt(saltRounds: number) {
  return encryptionHandler(genSalt(saltRounds));
}

export async function generateHash(
  plainTextData: string,
  saltRounds = 10,
  salt: string | null = null,
): Promise<[hash: string, salt: string]> {
  let generatedSalt = salt;
  if (!generatedSalt) {
    generatedSalt = await generateSalt(saltRounds);
  }
  const generatedHash = await encryptionHandler(
    hash(plainTextData, generatedSalt),
  );

  return [generatedHash, generatedSalt];
}

export async function compareWithHash(
  plainTextData: string,
  hashedData: string,
) {
  return encryptionHandler(compare(plainTextData, hashedData));
}
