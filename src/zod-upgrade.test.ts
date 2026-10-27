import { describe, expect, test } from "vitest";
import { buildApp } from "./app.js";

describe("zod 4 upgrade", () => {
  test("parses nested config and strips unknown keys", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/projects",
      payload: { name: "a", config: { retries: 2 }, extra: "x" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ name: "a", config: { retries: 2 } });
  });

  test("reports zod 4 validation errors", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/projects",
      payload: { name: 123 },
    });
    expect(res.statusCode).toBe(500);
    expect(res.json().error).toContain(
      "Invalid input: expected string, received number",
    );
  });
});
