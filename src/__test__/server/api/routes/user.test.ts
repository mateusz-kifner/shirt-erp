// import { appRouter, type AppRouter } from "@/server/api/root";
// import { type inferProcedureInput } from "@trpc/server";
// import { session } from "../../../_test.session";
// import { createInnerTRPCContext } from "@/server/api/trpc";
// import { afterAll, beforeAll, describe, test, expect } from "vitest";

// const entryName = "user";

// const ctx = createInnerTRPCContext({ session });

// const caller = appRouter.createCaller(ctx);

// const ids: string[] = [];

// beforeAll(async () => {
//   const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
//     name: "Ala",
//     email: "ala.kowalska@example.com",
//   };
//   const create = await caller[entryName].create(input);
//   if (create === undefined) throw new Error("creating user failed");
//   ids.push(create.id);
// });

// afterAll(async () => {
//   for (const id of ids) {
//     await caller[entryName].deleteById(id);
//   }
// });

// describe("User", () => {
//   test("create and delete", async () => {
//     const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
//       name: "Jan Malinowski",
//       email: "jan.malinowski@example.pl",
//     };
//     const create = await caller[entryName].create(input);

//     if (create === undefined) throw new Error("creating user failed");
//     const byId = await caller[entryName].getById(create.id);
//     expect(byId).toMatchObject(input);
//     expect(byId?.id).toBeTypeOf("string");

//     const deleteData = await caller[entryName].deleteById(byId!.id);
//     expect(deleteData).toMatchObject(input);
//     if (create === undefined) throw new Error("creating user failed");
//     const byId2 = await caller[entryName].getById(create.id);
//     expect(byId2).toBeUndefined();
//   });

//   test("update", async () => {
//     if (ids[0] === undefined) throw new Error("No Customers in test");
//     const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
//       id: ids[0],
//       name: "Test",
//     };

//     const update = await caller[entryName].update(input);

//     if (update?.id === undefined) throw new Error("Update failed");
//     const byId = await caller[entryName].getById(update.id);
//     expect(byId).toMatchObject(input);
//   });

//   test("update address", async () => {
//     if (ids[0] === undefined) throw new Error("No Customers in test");
//     const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
//       id: ids[0],
//     };

//     const update = await caller[entryName].update(input);
//     if (update?.id === undefined) throw new Error("Update failed");
//     const byId = await caller[entryName].getById(update.id);
//     expect(byId).toMatchObject(input);
//   });

//   test("update id not found", async () => {
//     const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
//       id: "wrong-id",
//       name: "Ala",
//     };
//     await expect(() => caller[entryName].update(input)).rejects.toThrow();
//   });
// });
