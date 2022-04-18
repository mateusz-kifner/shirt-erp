const qs = require("qs")
const query = qs.stringify(
  {
    populate: ["*"],
  },
  {
    encodeValuesOnly: true,
  }
)

console.log(query)
