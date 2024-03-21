import type { CellBase, DataViewerProps, Dimensions } from "react-spreadsheet";
import isNumeric from "../../utils/isNumeric";

/** Get the offset values of given element */
export function getOffsetRect(element: HTMLElement): Dimensions {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    left: element.offsetLeft,
    top: element.offsetTop,
  };
}

export const TRUE_TEXT = "TRUE";
export const FALSE_TEXT = "FALSE";

const DataViewer = <Cell extends CellBase<Value>, Value>({
  cell,
  evaluatedCell,
}: DataViewerProps<Cell>): React.ReactElement => {
  const value = evaluatedCell?.value ?? cell?.value;

  return typeof value === "boolean" ? (
    <span className="Spreadsheet__data-viewer Spreadsheet__data-viewer--boolean">
      {convertBooleanToText(value)}
    </span>
  ) : (
    <span
      className="Spreadsheet__data-viewer"
      style={{ textAlign: isNumeric(value) ? "right" : "left" }}
    >
      {/* @ts-ignore*/}
      {value}
    </span>
  );
};

export default DataViewer;

export function convertBooleanToText(value: boolean): string {
  return value ? TRUE_TEXT : FALSE_TEXT;
}
