import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connectionUri = process.env.DATABASE_URL ?? "mysql://root:password@localhost:3306/project1_db";

export const poolConnection = mysql.createPool(connectionUri);

export const db = drizzle(poolConnection, { schema, mode: "default" });
