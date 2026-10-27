import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export class DuplicateEmailError extends Error {
  constructor(message = "Email sudah terdaftar") {
    super(message);
    this.name = "DuplicateEmailError";
  }
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(input: RegisterUserInput) {
  const { name, email, password } = input;

  // 1. Periksa apakah email sudah terdaftar
  const existingUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUsers.length > 0) {
    throw new DuplicateEmailError("Email sudah terdaftar");
  }

  // 2. Hash password menggunakan bcrypt bawaan Bun
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // 3. Simpan data user ke database
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: "OK" };
}
