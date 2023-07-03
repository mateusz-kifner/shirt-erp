function TableCenterIcon({
  size = 24,
  color = "currentColor",
  stroke = 2,
  action_color = "currentColor",
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-table"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={stroke}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect
        x={10}
        y={4}
        width={4}
        height={16}
        fill={action_color}
        stroke="none"
      />
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x={4} y={4} width={16} height={16} rx={2} />
      <line x1={4.2} y1={10} x2={9.5} y2={10} />
      <line x1={4.2} y1={14} x2={9.5} y2={14} />
      <line x1={14.5} y1={10} x2={19.8} y2={10} />
      <line x1={14.5} y1={14} x2={19.8} y2={14} />
      <line x1={10} y1={4.2} x2={10} y2={19.8} />
      <line x1={14} y1={4.2} x2={14} y2={19.8} />
    </svg>
  );
}

export default TableCenterIcon;
