import { z } from "zod";

const Vector2Schema = z.object({ x: z.number(), y: z.number() });

export type TypeVector2 = z.infer<typeof Vector2Schema>;

export default Vector2Schema;
