import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Dimensions, Point } from "react-spreadsheet";

import TablerIconType from "@/schema/TablerIconType";
import { IconCheck, IconX } from "@tabler/icons-react";
import { merge } from "lodash";
import type { FC } from "react";
import type { CellBase, CellComponentProps } from "react-spreadsheet";
import { getRandomColorByNumber } from "../../utils/getRandomColor";

/** Get the offset values of given element */
export function getOffsetRect(element: HTMLElement): Dimensions {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    left: element.offsetLeft,
    top: element.offsetTop,
  };
}

type CellWithIcons = CellComponentProps<
  CellBase<string> & {
    metaId?: number;
    metaPropertyId?: number;
    style?: CSSProperties;
    active?: any;
  }
> & {
  icons: TablerIconType[];
};

export const Cell = ({
  row,
  column,
  DataViewer,
  selected,
  active,
  dragging,
  mode,
  data,
  select,
  activate,
  evaluatedData,
  copied,
  setCellData,
  setCellDimensions,
  icons,
}: CellWithIcons) => {
  const rootRef = useRef<HTMLTableCellElement | null>(null);
  const point = useMemo(
    (): Point => ({
      row,
      column,
    }),
    [row, column]
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      if (mode === "view") {
        setCellDimensions(point, getOffsetRect(event.currentTarget));

        if (event.shiftKey) {
          select(point);
        } else {
          activate(point);
        }
      }
    },
    [mode, setCellDimensions, point, select, activate]
  );

  const handleMouseOver = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      if (dragging) {
        setCellDimensions(point, getOffsetRect(event.currentTarget));
        select(point);
      }
    },
    [setCellDimensions, select, dragging, point]
  );
  useEffect(() => {
    const root = rootRef.current;
    if (selected && root) {
      setCellDimensions(point, getOffsetRect(root));
    }
    if (root && active && mode === "view") {
      root.focus();
    }
  }, [setCellDimensions, selected, active, mode, point, data]);

  if (data && data.DataViewer) {
    DataViewer = data.DataViewer;
  }

  const Icon = icons?.[data?.metaPropertyId ?? -1];

  return (
    <td
      ref={rootRef}
      className={"Spreadsheet__cell relative"}
      style={merge(data?.style, {
        background: data?.metaId
          ? getRandomColorByNumber(data.metaId) + "88"
          : undefined,
      })}
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
      tabIndex={0}
    >
      {Icon && (
        <Icon size={12} style={{ position: "absolute", top: 0, right: 0 }} />
      )}
      {data?.active &&
        (data.active === data.value ? (
          <IconCheck
            size={12}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        ) : (
          <IconX size={12} style={{ position: "absolute", top: 0, left: 0 }} />
        ))}

      <DataViewer
        row={row}
        column={column}
        cell={data ?? { value: "" }}
        setCellData={setCellData}
        evaluatedCell={evaluatedData}
      />
    </td>
  );
};

export const enhance = (
  CellComponent: FC<CellWithIcons>,
  icons: TablerIconType[]
): FC<CellWithIcons> => {
  return function CellWrapper(props) {
    return <CellComponent {...props} icons={icons} />;
  };
};
