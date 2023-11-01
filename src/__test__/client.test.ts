import { appRouter, AppRouter } from "@/server/api/root";
import { inferProcedureInput, TRPCError } from "@trpc/server";
import { db } from "@/db";
import { Session } from "next-auth";

const entryName = "client";

const ctx = {
  session: {
    expires: "2023-10-31T17:54:05.000Z",
    user: {
      id: "93f80379-165c-4520-984d-c2c4cbe7b7c9",
      name: "Mateusz Kifner",
      email: "noreply@shirterp.eu",
      emailVerified: "2023-10-31T17:54:05.000Z",
      image: null,
      role: "admin",
      updatedAt: "2023-10-23T00:59:07.000Z",
      createdAt: "2023-10-22T21:33:54.000Z",
      createdById: null,
      updatedById: "93f80379-165c-4520-984d-c2c4cbe7b7c9",
    },
  } as Session,
  db,
};

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
    if (byId?.id) {
      const deleteData = await caller[entryName].deleteById(byId.id);
      expect(deleteData).toMatchObject(input);
    }
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

    expect(async () => {
      await caller[entryName].update(input);
    }).toThrow(
      new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not update",
      }),
    );
  });
});
