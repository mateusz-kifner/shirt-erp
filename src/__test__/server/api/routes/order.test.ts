import { appRouter, type AppRouter } from "@/server/api/root";
import { type inferProcedureInput } from "@trpc/server";
import { session } from "../../../_test.session";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { afterAll, beforeAll, describe, test, expect } from "vitest";

// const entryName = "order";

// const ctx = createInnerTRPCContext({ session });

// const caller = appRouter.createCaller(ctx);

// const ids: number[] = [];

// beforeAll(async () => {
//   const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
//     name: "Ala",
//     notes: "test<br/>test",
//     price: "213.44",
//     isPricePaid: true,
//     workTime: 123,
//     status: "sent",
//     address: {
//       streetName: "Barniewicka",
//       streetNumber: "633",
//       apartmentNumber: "244",
//       city: "Gdańsk",
//       postCode: "12-345",
//       province: "pomorskie",
//       secondLine: "",
//     },
//   };
//   const create = await caller[entryName].create(input);
//   ids.push(create.id);
// });

// afterAll(async () => {
//   for (const id of ids) {
//     await caller[entryName].deleteById(id);
//   }
// });

// describe("Order", () => {
//   test("create and delete", async () => {
//     const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
//       name: "Ala",
//       notes: "test<br/>test",
//       price: "213.44",
//       isPricePaid: true,
//       workTime: 123,
//       status: "sent",
//       address: {
//         streetName: "Barniewicka",
//         streetNumber: "633",
//         apartmentNumber: "244",
//         city: "Gdańsk",
//         postCode: "12-345",
//         province: "pomorskie",
//         secondLine: "",
//       },
//     };
//     const create = await caller[entryName].create(input);
//     const byId = await caller[entryName].getById(create.id);

//     expect(byId).toMatchObject(input);
//     expect(byId?.id).toBeTypeOf("number");

//     const deleteData = await caller[entryName].deleteById(byId!.id);
//     expect(deleteData).toMatchObject(input);
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

//     // if (update?.id === undefined) throw new Error("Update failed");
//     // const byId = await caller[entryName].getById(update.id);
//     // expect(byId).toMatchObject(input);
//   });

//   test("update address", async () => {
//     if (ids[0] === undefined) throw new Error("No Customers in test");
//     const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
//       id: ids[0],
//       address: {
//         streetName: "Lawendowa",
//         streetNumber: "1234",
//         apartmentNumber: "4567",
//       },
//     };

//     const update = await caller[entryName].update(input);
//     // if (update?.id === undefined) throw new Error("Update failed");
//     // const byId = await caller[entryName].getById(update.id);
//     // expect(byId).toMatchObject(input);
//   });

//   test("update id not found", async () => {
//     const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
//       id: 9999999,
//       name: "Test2",
//     };
//     await expect(() => caller[entryName].update(input)).rejects.toThrow();
//   });
// });
