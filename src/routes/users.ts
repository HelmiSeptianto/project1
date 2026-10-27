import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";

export const userRoutes = new Elysia({ prefix: "/users" })
  .get("/", async () => {
    try {
      const allUsers = await db.select().from(users);
      return {
        success: true,
        data: allUsers,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to query database. Ensure MySQL is running and credentials in .env are correct.",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const result = await db.insert(users).values({
          name: body.name,
          email: body.email,
        });
        set.status = 201;
        return {
          success: true,
          message: "User created successfully",
          data: result,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to insert user. Ensure MySQL is running and credentials in .env are correct.",
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
      }),
    }
  );
