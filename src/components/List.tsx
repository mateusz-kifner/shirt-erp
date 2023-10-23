/* eslint-disable @typescript-eslint/no-explicit-any */
import { useId } from "react";

interface ListProps<T = any> {
  ListItem: React.ElementType;
  onChange?: (val: T) => void;
  listItemProps?: Record<string, any>; // { linkTo: (val: T) => string } |
  selectedId?: string | number | null;
  data?: T[];
}

function List<T extends { id: number | string }>(props: ListProps<T>) {
  const {
    ListItem,
    onChange = (_val: T) => {
      /* no-op */
    },
    listItemProps = {},
    selectedId,
    data = [],
  } = props;
  const uuid = useId();

  return (
    <div className="flex flex-col gap-2">
      {data &&
        data.map((val, index) => (
          <ListItem
            key={uuid + "_" + index}
            value={val}
            onChange={onChange}
            {...listItemProps}
            active={val.id === selectedId}
          />
        ))}
    </div>
  );
}

export default List;
