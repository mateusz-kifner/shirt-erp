/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
const sortObjectByDateOrNull =
  (keyName: string, sortOrder: "asc" | "desc" = "asc") =>
  (a: any, b: any) => {
    const multiplier = sortOrder === "asc" ? -1 : 1;
    if (!a[keyName] && !b[keyName]) return 0;
    if (!a[keyName]) return 1;
    if (!b[keyName]) return -1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return (a[keyName].getTime() - b[keyName].getTime()) * multiplier;
  };

export default sortObjectByDateOrNull;
