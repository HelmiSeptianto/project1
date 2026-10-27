import { Elysia } from "elysia";
import { userRoutes } from "./routes/users";

const port = Number(process.env.PORT ?? 3000);

const app = new Elysia()
  .get("/", () => ({
    name: "project1 API",
    status: "ok",
    runtime: "Bun",
    framework: "ElysiaJS",
    orm: "Drizzle",
    database: "MySQL",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({
    status: "healthy",
  }))
  .use(userRoutes)
  .listen(port);

console.log(`🦊 Elysia server is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
