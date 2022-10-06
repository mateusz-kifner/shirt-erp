import Crypto from "crypto";

function randomString(size = 48) {
  return Crypto.randomBytes(size).toString("base64").slice(0, size);
}

export default {
  beforeCreate: (event) => {
    const token = randomString().replace(/\//, "_").replace(/\+/, "-");
    // console.log("beforeCreate", event.params, token);
    event.params = { ...event.params, token };
  },
};
