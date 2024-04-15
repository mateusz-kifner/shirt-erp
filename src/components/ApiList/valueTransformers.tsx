import { addressToString } from "@/server/api/address/utils";
import dayjs from "dayjs";
import { cn } from "@/utils/cn";

export const DateValueTransformer = ({ value }: { value?: any }) =>
  value instanceof Date
    ? dayjs(value).format("LT L").toString()
    : "[ Unknown date format ]";

export const AddressValueTransformer = ({ value }: { value?: any }) =>
  addressToString(value);

export const BooleanValueTransformer = ({ value }: { value?: any }) =>
  value !== undefined ? (
    <div
      className={cn(
        "w-10 rounded-md p-0.5 text-center",
        value ? "bg-green-700" : "bg-red-700",
      )}
    >
      {value ? "Tak" : "Nie"}
    </div>
  ) : (
    "Not set"
  );
