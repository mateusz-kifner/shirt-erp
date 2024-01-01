import { productRouter } from "@/server/api/routers/product";
import { sessionRouter } from "@/server/api/routers/session";
import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "./routers/example";
import { clientRouter } from "./routers/client";
import { spreadsheetRouter } from "./routers/spreadsheet";
import { orderRouter } from "./routers/order";
import { userRouter } from "./routers/user";
import { searchRouter } from "./routers/search";
import { emailRouter } from "./routers/email";
import { expenseRouter } from "./routers/expense";
import { settingsRouter } from "./routers/settings";
import { adminRouter } from "./routers/admin";
import { addressRouter } from "./routers/address";
import { globalPropertiesRouter } from "./routers/global_properties";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  address: addressRouter,
  example: exampleRouter,
  session: sessionRouter,
  product: productRouter,
  settings: settingsRouter,
  client: clientRouter,
  order: orderRouter,
  spreadsheet: spreadsheetRouter,
  user: userRouter,
  search: searchRouter,
  email: emailRouter,
  expense: expenseRouter,
  admin: adminRouter,
  "global-properties": globalPropertiesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
