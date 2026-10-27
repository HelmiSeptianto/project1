import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { usersRoute } from "../src/routes/users-route";
import { DuplicateEmailError } from "../src/services/users-service";

describe("Users Registration & Route", () => {
  const app = new Elysia().use(usersRoute);

  it("should return validation error when request body is empty", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(400);
    const result = (await response.json()) as { error?: string };
    expect(result.error).toBe("Data input tidak valid");
  });

  it("should return validation error when fields are missing", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Eko",
        }),
      })
    );

    expect(response.status).toBe(400);
    const result = (await response.json()) as { error?: string };
    expect(result.error).toBe("Data input tidak valid");
  });

  it("should correctly hash password using bcrypt", async () => {
    const rawPassword = "rahasia";
    const hashed = await Bun.password.hash(rawPassword, {
      algorithm: "bcrypt",
      cost: 10,
    });

    expect(hashed).toStartWith("$2b$10$");
    const isMatch = await Bun.password.verify(rawPassword, hashed);
    expect(isMatch).toBe(true);
  });

  it("DuplicateEmailError should have message 'Email sudah terdaftar'", () => {
    const err = new DuplicateEmailError();
    expect(err.message).toBe("Email sudah terdaftar");
  });
});
