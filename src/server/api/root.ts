import { productRouter } from "@/server/api/routers/product";
import { sessionRouter } from "@/server/api/routers/session";
import { createTRPCRouter } from "@/server/api/trpc";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  session: sessionRouter,
  product: productRouter,
  settings: settingsRouter,
  client: clientRouter,
  order: orderRouter,
  "order-archive": orderArchiveRouter,
  spreadsheet: spreadsheetRouter,
  design: designRouter,
  user: userRouter,
  search: searchRouter,
  email: emailRouter,
  expense: expenseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
