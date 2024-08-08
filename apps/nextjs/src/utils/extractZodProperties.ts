import { z } from "zod";

//, O = z.infer<S>
export function extractZodProperties<S extends z.ZodTypeAny>(zObj: S) {
  if (zObj._def.innerType !== undefined) {
    return extractZodProperties(zObj._def.innerType);
  }
  if (zObj instanceof z.ZodObject) {
    const obj = zObj._def.shape();
    const new_obj = { ...obj };
    for (const o in obj) {
      new_obj[o] = extractZodProperties(obj[o]);
    }
    return new_obj;
  }
  if (zObj._def.values) {
    return { type: zObj._def.typeName, values: zObj._def.values };
  }
  return { type: zObj._def.typeName };
}
