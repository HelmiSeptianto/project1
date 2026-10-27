import { Elysia, t } from "elysia";
import { registerUser, DuplicateEmailError } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .onError(({ error, code, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { error: "Data input tidak valid" };
    }
  })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const result = await registerUser(body);
        set.status = 200;
        return result;
      } catch (error) {
        if (error instanceof DuplicateEmailError) {
          set.status = 400;
          return { error: error.message };
        }

        // Handle MySQL duplicate key error (ER_DUP_ENTRY)
        if (typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY") {
          set.status = 400;
          return { error: "Email sudah terdaftar" };
        }

        set.status = 500;
        return {
          error: error instanceof Error ? error.message : "Terjadi kesalahan pada server",
        };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1 }),
      }),
    }
  );
