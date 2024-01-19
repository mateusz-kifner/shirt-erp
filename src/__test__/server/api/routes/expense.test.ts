import { appRouter, type AppRouter } from "@/server/api/root";
import { type inferProcedureInput } from "@trpc/server";
import { session } from "../../../_test.session";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { afterAll, beforeAll, describe, test, expect } from "vitest";

// const entryName = "expense";

// const ctx = createInnerTRPCContext({ session });

// const caller = appRouter.createCaller(ctx);

// const ids: number[] = [];

// beforeAll(async () => {
//   const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
//     name: "test",
//     cost: "123.0",
//     expenseData: [{ name: "Farba", amount: 4 }],
//   };
//   const create = await caller[entryName].create(input);
//   ids.push(create.id);
// });

// afterAll(async () => {
//   for (const id of ids) {
//     await caller[entryName].deleteById(id);
//   }
// });

// describe("Expense", () => {
//   test("create and delete", async () => {
//     const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
//       name: "test2",
//       cost: "1234.00",
//       expenseData: [{ name: "Farba2", amount: 5 }],
//     };
//     const create = await caller[entryName].create(input);
//     const byId = await caller[entryName].getById(create.id);

//     expect(byId).toMatchObject(input);
//     expect(byId?.id).toBeTypeOf("number");

//     const deleteData = await caller[entryName].deleteById(byId!.id);
//     expect(deleteData).toMatchObject(input);
//   });

//   test("update", async () => {
//     if (ids[0] === undefined) throw new Error("No Address in test");
//     const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
//       id: ids[0],
//       name: "Ala nie ma kota",
//       cost: "567.00",
//     };

//     const update = await caller[entryName].update(input);

//     if (update?.id === undefined) throw new Error("Update failed");
//     const byId = await caller[entryName].getById(update.id);
//     expect(byId).toMatchObject(input);
//   });

//   test("update id not found", async () => {
//     const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
//       id: 9999999,
//       name: "test",
//     };
//     await expect(() => caller[entryName].update(input)).rejects.toThrow();
//   });
// });
