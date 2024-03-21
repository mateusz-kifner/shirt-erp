import emailMessageService from "@/server/api/email-message/service";
import fileService from "@/server/api/file/service";
import orderService from "@/server/api/order/service";
import productService from "@/server/api/product/service";
import userService from "@/server/api/user/service";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

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
    const byId = await orderService.getByIdFull(create.id);

    expect(byId?.id).toBeTypeOf("number");
    expect(byId).toMatchObject(order);

    const deleteData = await orderService.deleteById(byId.id);
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

describe("Order to Product relation", () => {
  let productId: number | undefined;
  let orderId: number | undefined;
  beforeAll(async () => {
    const product = await productService.create({ name: "Test Product 789" });
    productId = product.id;
    const order = await orderService.create({ name: "Test Order 789" });
    orderId = order.id;
  });

  afterAll(async () => {
    if (productId !== undefined) await productService.deleteById(productId);
    if (orderId !== undefined) await orderService.deleteById(orderId);
  });

  test("update connect Product", async () => {
    const data = await orderService.productRelation.connect(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      orderId!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      productId!,
    );
    expect(data).toMatchObject({
      orderId,
      productId,
    });
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const byId = await orderService.getByIdFull(orderId!);
    expect(byId.products.length).toBeGreaterThan(0);
    expect(byId.products[0]?.name).toEqual("Test Product 789");
  });
  test("update disconnect Product", async () => {
    const data = await orderService.productRelation.disconnect(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      orderId!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      productId!,
    );
    expect(data).toMatchObject({
      orderId,
      productId,
    });

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const byId = await orderService.getByIdFull(orderId!);
    expect(byId.products.length).toEqual(0);
  });
});

describe("Order to File relation", () => {
  let fileId: number | undefined;
  let orderId: number | undefined;
  beforeAll(async () => {
    const file = await fileService.create({
      filename: "Test File 789",
      size: 123,
      filepath: "[nope]",
      originalFilename: "[nope]",
      newFilename: "[nope]",
      mimetype: "text/html",
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any); // TODO: find why this errors
    fileId = file.id;
    const order = await orderService.create({ name: "Test Order 789" });
    orderId = order.id;
  });

  afterAll(async () => {
    if (fileId !== undefined) await fileService.deleteById(fileId);
    if (orderId !== undefined) await orderService.deleteById(orderId);
  });

  test("update connect File", async () => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const data = await orderService.fileRelation.connect(orderId!, fileId!);
    expect(data).toMatchObject({
      orderId,
      fileId,
    });
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const byId = await orderService.getByIdFull(orderId!);
    expect(byId.files.length).toBeGreaterThan(0);
    expect(byId.files[0]?.filename).toEqual("Test File 789");
  });
  test("update disconnect File", async () => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const data = await orderService.fileRelation.disconnect(orderId!, fileId!);
    expect(data).toMatchObject({
      orderId,
      fileId,
    });

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const byId = await orderService.getByIdFull(orderId!);
    expect(byId.files.length).toEqual(0);
  });
});

describe("Order to User relation", () => {
  let userId: string | undefined;
  let orderId: number | undefined;
  beforeAll(async () => {
    const user = await userService.create({
      email: "jan.kowalski@example.pl",
      role: "employee",
      name: "Jan Kowalski",
    });
    userId = user.id;
    const order = await orderService.create({ name: "Test Order 789" });
    orderId = order.id;
  });

  afterAll(async () => {
    if (userId !== undefined) await userService.deleteById(userId);
    if (orderId !== undefined) await orderService.deleteById(orderId);
  });

  test("update connect User", async () => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const data = await orderService.userRelation.connect(orderId!, userId!);
    expect(data).toMatchObject({
      orderId,
      userId,
    });
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const byId = await orderService.getByIdFull(orderId!);
    expect(byId.employees.length).toBeGreaterThan(0);
    expect(byId.employees[0]?.name).toEqual("Jan Kowalski");
  });
  test("update disconnect User", async () => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const data = await orderService.userRelation.disconnect(orderId!, userId!);
    expect(data).toMatchObject({
      orderId,
      userId,
    });

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const byId = await orderService.getByIdFull(orderId!);
    expect(byId.employees.length).toEqual(0);
  });
});

describe("Order to EmailMessage relation", () => {
  let emailMessageId: number | undefined;
  let orderId: number | undefined;
  beforeAll(async () => {
    const emailMessage = await emailMessageService.create({
      subject: "Test EmailMessage 789",
    });
    emailMessageId = emailMessage.id;
    const order = await orderService.create({ name: "Test Order 789" });
    orderId = order.id;
  });

  afterAll(async () => {
    if (emailMessageId !== undefined)
      await emailMessageService.deleteById(emailMessageId);
    if (orderId !== undefined) await orderService.deleteById(orderId);
  });

  test("update connect EmailMessage", async () => {
    const data = await orderService.emailMessageRelation.connect(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      orderId!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      emailMessageId!,
    );
    expect(data).toMatchObject({
      orderId,
      emailMessageId,
    });
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const byId = await orderService.getByIdFull(orderId!);
    expect(byId.emails.length).toBeGreaterThan(0);
    expect(byId.emails[0]?.subject).toEqual("Test EmailMessage 789");
  });
  test("update disconnect EmailMessage", async () => {
    const data = await orderService.emailMessageRelation.disconnect(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      orderId!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      emailMessageId!,
    );
    expect(data).toMatchObject({
      orderId,
      emailMessageId,
    });

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const byId = await orderService.getByIdFull(orderId!);
    expect(byId.emails.length).toEqual(0);
  });
});
