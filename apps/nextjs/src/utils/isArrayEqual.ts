import _ from "lodash";

const isArrayEqual = (x: any, y: any) => {
  return _(x).xorWith(y, _.isEqual).isEmpty();
};

export default isArrayEqual;
