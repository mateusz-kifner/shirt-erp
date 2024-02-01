import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationClient, migrationDb } from "@/db";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

async function main() {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(migrationDb, { migrationsFolder: "./src/db/migration" });

  // Don't forget to close the connection, otherwise the script will hang
  await migrationClient.end();
}

main().catch((err) => console.log(err));
