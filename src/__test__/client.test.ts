import { appRouter, AppRouter } from "@/server/api/root";
import { inferProcedureInput, TRPCError } from "@trpc/server";
import { session } from "./_test.session";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { afterAll, beforeAll, describe, test, expect } from "vitest";

const entryName = "client";

const ctx = createInnerTRPCContext({ session });

const caller = appRouter.createCaller(ctx);

let ids: number[] = [];

beforeAll(async () => {
  const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
    firstname: "Ala",
    lastname: "Kowalska",
  };
  const create = await caller[entryName].create(input);
  ids.push(create.id);
});

afterAll(async () => {
  for (let id of ids) {
    await caller[entryName].deleteById(id);
  }
});

describe("Client", () => {
  test("create and delete", async () => {
    const input: inferProcedureInput<AppRouter[typeof entryName]["create"]> = {
      firstname: "Ala",
      lastname: "Kowalska",
    };
    const create = await caller[entryName].create(input);
    const byId = await caller[entryName].getById(create.id);

    expect(byId).toMatchObject(input);
    expect(byId?.id).toBeTypeOf("number");

    const deleteData = await caller[entryName].deleteById(byId!.id);
    expect(deleteData).toMatchObject(input);
  });

  test("update", async () => {
    if (ids[0] === undefined) throw new Error("No Clients in test");
    const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
      id: ids[0],
      firstname: "Test",
      lastname: "Test",
    };

    const update = await caller[entryName].update(input);

    if (update?.id === undefined) throw new Error("Update failed");
    const byId = await caller[entryName].getById(update.id);
    expect(byId).toMatchObject(input);
  });

  test("update id not found", async () => {
    const input: inferProcedureInput<AppRouter[typeof entryName]["update"]> = {
      id: 9999999,
      firstname: "Test",
      lastname: "Test",
    };
    await expect(() => caller[entryName].update(input)).rejects.toThrow();
  });
});
