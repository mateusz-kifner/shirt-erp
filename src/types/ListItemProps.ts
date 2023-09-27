export interface ListItemProps<T> {
  onChange?: (item: Partial<T>) => void;
  value: Partial<T>;
  active?: boolean;
  disabled?: boolean;
}
