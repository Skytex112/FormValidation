import type { SQLiteDatabase } from "expo-sqlite";
import type { UserRegistrationFormData } from "../schemas/userSchema";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      age INTEGER NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function createUser(
  db: SQLiteDatabase,
  data: UserRegistrationFormData,
  passwordHash: string
) {
  const existingUser = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM users WHERE email = ?",
    data.email
  );

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  await db.runAsync(
    `
      INSERT INTO users
        (first_name, email, age, password_hash)
      VALUES (?, ?, ?, ?)
    `,
    data.firstName,
    data.email,
    data.age,
    passwordHash
  );
}