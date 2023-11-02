import { appRouter, AppRouter } from "@/server/api/root";
import { inferProcedureInput, TRPCError } from "@trpc/server";
import { session } from "../../../_test.session";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { afterAll, beforeAll, describe, test, expect } from "vitest";

const entryName = "address";

const ctx = createInnerTRPCContext({ session });

const caller = appRouter.createCaller(ctx);

let ids: number[] = [];

beforeAll(async () => {
  const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
    streetName: "Lawendowa",
    streetNumber: "234",
    apartmentNumber: "567",
  };
  const create = await caller[entryName].create(input);
  ids.push(create.id);
});

afterAll(async () => {
  for (let id of ids) {
    await caller[entryName].deleteById(id);
  }
});

describe("Address", () => {
  test("create and delete", async () => {
    const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
      streetName: "Tymiankowa",
      streetNumber: "123",
      apartmentNumber: "456",
    };
    const create = await caller[entryName].create(input);
    const byId = await caller[entryName].getById(create.id);

    expect(byId).toMatchObject(input);
    expect(byId?.id).toBeTypeOf("number");

    const deleteData = await caller[entryName].deleteById(byId!.id);
    expect(deleteData).toMatchObject(input);
  });

  test("update", async () => {
    if (ids[0] === undefined) throw new Error("No Address in test");
    const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
      id: ids[0],
      streetName: "Test",
      streetNumber: "Test",
      apartmentNumber: "Test",
    };

    const update = await caller[entryName].update(input);

    if (update?.id === undefined) throw new Error("Update failed");
    const byId = await caller[entryName].getById(update.id);
    expect(byId).toMatchObject(input);
  });

  test("update id not found", async () => {
    const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
      id: 9999999,
      city: "Gdańsk",
    };
    await expect(() => caller[entryName].update(input)).rejects.toThrow();
  });
});
