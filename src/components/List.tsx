import { useId } from "react";

interface ListProps<T = any> {
  ListItem: React.ElementType;
  onChange?: (val: T) => void;
  listItemProps?: { linkTo: (val: T) => string } | any;
  selectedId?: number | null;
  data?: T[];
}

function List<T>(props: ListProps<T>) {
  const {
    ListItem,
    onChange = (val: T) => {
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
        data.map((val: any, index: number) => (
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
