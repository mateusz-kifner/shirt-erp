import { useEffect, useState } from "react";

export function useLoaded() {
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => setLoaded(true), []);
  return loaded;
}
