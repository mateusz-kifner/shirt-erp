import { z } from "zod";

export const flags = z
  .object({
    root: z
      .object({
        editable_address_mode: z
          .enum(["popup", "extend", "always_visible"])
          .default("always_visible"),
        mobile_override: z.enum(["auto", "mobile", "desktop"]).default("auto"),
        zoom_level: z.enum(["-3", "-2", "-1", "0", "1", "2", "3"]).default("0"),
      })
      .default({}),
    navigation: z
      .object({
        main_navigation_type: z.enum(["icons", "list"]).default("list"),
        main_navigation_hover: z.boolean().default(false),
      })
      .default({}),
    calendar: z
      .object({
        default_click: z.enum(["order", "task"]).default("task"),
        default_view_mode: z.enum(["month", "week"]).default("month"),
        default_data_source: z.enum(["all", "user"]).default("user"),
      })
      .default({}),
  })
  .default({});

export type Flags = z.infer<typeof flags>;
