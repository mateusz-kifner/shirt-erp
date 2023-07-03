import { STATUS_CODES } from "http";
import { startCase, toLower } from "lodash";

class HTTPError extends Error {
  statusCode: number;

  constructor(code: number, message: string, extras?: any) {
    super(message || STATUS_CODES[code]);
    if (arguments.length >= 3 && extras) {
      Object.assign(this, extras);
    }
    this.name = toHTTPErrorName(code).replaceAll(" ", "");
    this.statusCode = code;
  }
}
export default HTTPError;

/**
 * Converts an HTTP status code to an Error `name`.
 * Ex:
 *   302 => "Found"
 *   404 => "NotFoundError"
 *   500 => "InternalServerError"
 */

export function toHTTPErrorName(code: number): string {
  const suffix =
    ((code / 100) | 0) === 4 || ((code / 100) | 0) === 5 ? " error" : "";
  return startCase(
    toLower(String(STATUS_CODES[code]).replace(/error$/i, "") + suffix)
  );
}
