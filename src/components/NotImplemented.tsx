const NotImplemented = (props: any) => {
  return (
    <div
      style={{
        border: "1px solid #f23",
        borderRadius: 4,
        margin: 4,
        padding: 4,
      }}
    >
      <h5>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-plus-operands */}
        Not implemented {props?.message ? " - " + props.message : ""}{" "}
      </h5>
      <code
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          padding: "0",
          boxSizing: "border-box",
          whiteSpace: "pre",
        }}
      >
        {JSON.stringify(props, null, 2)}
      </code>
    </div>
  );
};

export default NotImplemented;
