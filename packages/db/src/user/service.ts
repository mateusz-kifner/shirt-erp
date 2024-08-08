import { users } from "../auth/schema";
import { eq, inArray, sql } from "drizzle-orm";
import type { User, UpdatedUser, NewUser } from "./validator";
import { type DBType, db } from "..";
import type { MetadataType } from "../types/MetadataType";
import type { Err } from "../types/Err";

// compile query ahead of time
const userPrepareGetById = db.query.users
  .findFirst({
    where: eq(users.id, sql.placeholder("id")),
  })
  .prepare("userPrepareGetById");

async function getById(id: number): Promise<User | Err> {
  const user = await userPrepareGetById.execute({ id });
  if (!user)
    return {
      error: `[UserService]: Could not find user with id ${id}`,
    };
  return user;
}

// compile query ahead of time
const userPrepareGetByEmail = db.query.users
  .findFirst({
    where: eq(users.email, sql.placeholder("email")),
  })
  .prepare("userPrepareGetByEmail");

async function getByEmail(email: string): Promise<User | Err> {
  const user = await userPrepareGetByEmail.execute({ email });
  if (!user)
    return {
      error: `[UserService]: Could not find user with email ${email}`,
    };
  return user;
}

// compile query ahead of time
const userPrepareGetManyById = db
  .select()
  .from(users)
  .where(inArray(users.id, sql.placeholder("ids")))
  .prepare("userPrepareGetManyById");

async function getManyByIds(ids: number[]): Promise<User[] | Err> {
  const users = await userPrepareGetManyById.execute({ ids });
  if (users.length !== ids.length)
    return {
      error: `[UserService]: Could not find users with ids ${ids}`,
    };
  return users;
}

async function create(userData: NewUser, tx: DBType = db): Promise<User | Err> {
  const newUser = await tx.insert(users).values(userData).returning();
  if (!newUser[0])
    return {
      error: `[UserService]: Could not create user with name ${userData?.name}`,
    };
  return newUser[0];
}

async function deleteById(id: string, tx: DBType = db): Promise<User | Err> {
  const deletedUser = await tx
    .delete(users)
    .where(eq(users.id, id))
    .returning();
  if (!deletedUser[0])
    return {
      error: `[UserService]: Could not delete user with id ${id}`,
    };
  return deletedUser[0];
}

async function update(
  userData: UpdatedUser & MetadataType,
  tx: DBType = db,
): Promise<User | Err> {
  const { id, ...dataToUpdate } = userData;
  const updatedUser = await tx
    .update(users)
    .set(dataToUpdate)
    .where(eq(users.id, id))
    .returning();
  if (!updatedUser[0])
    return {
      error: `[UserService]: Could not update user with id ${id}`,
    };
  return updatedUser[0];
}

const userService = {
  getById,
  getByEmail,
  getManyByIds,
  create,
  deleteById,
  update,
};

export default userService;
