// import { appRouter, type AppRouter } from "@/server/api/root";
// import { type inferProcedureInput } from "@trpc/server";
// import { session } from "../../../_test.session";
// import { createInnerTRPCContext } from "@/server/api/trpc";
// import { afterAll, beforeAll, describe, test, expect } from "vitest";

// const entryName = "customer";

// const ctx = createInnerTRPCContext({ session });

// const caller = appRouter.createCaller(ctx);

// const ids: number[] = [];

// beforeAll(async () => {
//   const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
//     firstname: "Ala",
//     lastname: "Kowalska",
//     companyName: "Kowalska Sp.z.o.o.",
//     email: "ala.kowlaska@example.pl",
//     notes: "test<br/>test",
//     phoneNumber: "+48 123 123 123",
//     username: "ala.kowalska",
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

// describe("Customer", () => {
//   test("create and delete", async () => {
//     const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
//       firstname: "Jan",
//       lastname: "Malinowski",
//       companyName: "Kowalska Sp.z.o.o.",
//       email: "jan.malinowski@example.pl",
//       notes: "test<br/>test",
//       phoneNumber: "+48 123 123 123",
//       username: "jan.malinowski",
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
//       firstname: "Test",
//       lastname: "Test",
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
//       address: {
//         streetName: "Lawendowa",
//         streetNumber: "1234",
//         apartmentNumber: "4567",
//       },
//     };

//     const update = await caller[entryName].update(input);
//     if (update?.id === undefined) throw new Error("Update failed");
//     const byId = await caller[entryName].getById(update.id);
//     expect(byId).toMatchObject(input);
//   });

//   test("update id not found", async () => {
//     const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
//       id: 9999999,
//       firstname: "Test2",
//       lastname: "Test2",
//     };
//     await expect(() => caller[entryName].update(input)).rejects.toThrow();
//   });
// });
