import { describe, test, expect } from "vitest";
import orderService from "@/server/services/order";

const order = {
  name: "Ala",
  notes: "test<br/>test",
  price: "213.44",
  isPricePaid: true,
  workTime: 123,
  status: "sent",
};

describe("Order", () => {
  test("create and delete", async () => {
    const create = await orderService.create(order);
    const byId = await orderService.getFullById(create.id);

    expect(byId?.id).toBeTypeOf("number");
    expect(byId).toMatchObject(order);

    const deleteData = await orderService.deleteById(byId!.id);
    expect(deleteData).toMatchObject(order);

    // test async error
    await expect(
      (async () => {
        await orderService.getById(create.id);
      })(),
    ).rejects.toThrowError();
  });

  test("update", async () => {});

  test("update address", async () => {});

  test("update id not found", async () => {});
});
