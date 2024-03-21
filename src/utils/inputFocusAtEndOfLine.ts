import type { RefObject } from "react";

function inputFocusAtEndOfLine(
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement>,
) {
  ref.current?.focus();
  ref.current?.selectionStart &&
    (ref.current.selectionStart = ref.current.value.length);
}

export default inputFocusAtEndOfLine;
