import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq, sql } from "drizzle-orm";
import { UpdatedUser, User } from "@/schema/userZodSchema";
import { MetadataType } from "@/schema/MetadataType";
import { authDBAdapter } from "../auth";
import { type AdapterUser } from "next-auth/adapters";

// compile query ahead of time
const dbPrepareGetById = db.query.users
  .findFirst({
    where: eq(users.id, sql.placeholder("id")),
  })
  .prepare("dbPrepareGetById");

async function getById(id: string) {
  return await dbPrepareGetById.execute({ id });
}

async function create(userData: Partial<User>) {
  const newUser = await authDBAdapter.createUser?.({
    ...userData,
    emailVerified: new Date(),
  } as AdapterUser);
  if (newUser === undefined)
    throw new Error("[UserService]: Could not create user");
  return newUser;
}

async function deleteById(id: string) {
  return await db.delete(users).where(eq(users.id, id));
}

async function update(userData: UpdatedUser & MetadataType) {
  const { id, ...dataToUpdate } = userData;
  const updatedUser = await db
    .update(users)
    .set(dataToUpdate)
    .where(eq(users.id, id))
    .returning();
  if (updatedUser[0] === undefined)
    throw new Error("[UserService]: Could not update user");
  return updatedUser[0];
}

const userServices = { getById, create, deleteById, update };

export default userServices;
