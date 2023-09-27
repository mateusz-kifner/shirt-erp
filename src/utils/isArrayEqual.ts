import _ from "lodash";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isArrayEqual = (x: any, y: any) => {
  // eslint-disable-next-line
  return _(x).xorWith(y, _.isEqual).isEmpty();
};

export default isArrayEqual;
