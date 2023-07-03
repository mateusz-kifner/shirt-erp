import { clientRouter } from "@/server/api/routers/client";
import { exampleRouter } from "@/server/api/routers/example";
import { productRouter } from "@/server/api/routers/product";
import { sessionRouter } from "@/server/api/routers/session";
import { settingsRouter } from "@/server/api/routers/settings";
import { createTRPCRouter } from "@/server/api/trpc";
import { orderRouter } from "./routers/order";
import { spreadsheetRouter } from "./routers/spreadsheet";
import { userRouter } from "./routers/user";

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
  spreadsheet: spreadsheetRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
