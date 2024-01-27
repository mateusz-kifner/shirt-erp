import { createTRPCRouter } from "@/server/api/trpc";

import { addressRouter } from "./routers/address";
import { adminRouter } from "./routers/admin";
import { customerRouter } from "./routers/customer";
import { emailRouter } from "./routers/email";
import { exampleRouter } from "./routers/example";
import { expenseRouter } from "./routers/expense";
import { fileRouter } from "./routers/file";
import { orderRouter } from "./routers/order";
import { productRouter } from "@/server/api/routers/product";
import { searchRouter } from "./routers/search";
import { sessionRouter } from "@/server/api/routers/session";
import { settingsRouter } from "./routers/settings";
import { spreadsheetRouter } from "./routers/spreadsheet";
import { userRouter } from "./routers/user";
import { emailMessageRouter } from "./routers/email_message";
import { globalPropertyRouter } from "./routers/global_property";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  address: addressRouter,
  admin: adminRouter,
  customer: customerRouter,
  email: emailRouter,
  emailMessage: emailMessageRouter,
  example: exampleRouter,
  expense: expenseRouter,
  file: fileRouter,
  globalProperty: globalPropertyRouter,
  order: orderRouter,
  product: productRouter,
  search: searchRouter,
  session: sessionRouter,
  settings: settingsRouter,
  spreadsheet: spreadsheetRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
