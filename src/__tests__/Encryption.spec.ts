import { describe, expect, test } from "vitest";

import { compareWithHash, generateHash } from "../Encryption";

describe("encryption helpers", () => {
  test("generateHash produces a verifiable hash", async () => {
    const [hash, salt] = await generateHash("secret", 4);

    expect(salt).toHaveLength(29);
    await expect(compareWithHash("secret", hash)).resolves.toBe(true);
    await expect(compareWithHash("wrong", hash)).rejects.toThrow(
      "Parameters sent are invalid",
    );
  });
});
