import apiAddress from "./address";
import apiExpense from "./expense";
import apiFile from "./file";
import apiGlobalProperty from "./global_property";
import apiOrder from "./order";
import apiProduct from "./product";
import apiSpreadsheet from "./spreadsheet";
import apiUser from "./user";

const api = {
  address: apiAddress,
  expense: apiExpense,
  file: apiFile,
  globalProperty: apiGlobalProperty,
  order: apiOrder,
  product: apiProduct,
  spreadsheet: apiSpreadsheet,
  user: apiUser,
};

export default api;
