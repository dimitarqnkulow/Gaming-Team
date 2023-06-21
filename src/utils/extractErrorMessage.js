const { MongooseError } = require("mongoose");

exports.getErrorMessages = (err) => {
  if (err instanceof MongooseError && typeof err == Object) {
    return Object.values(err.errors).map((x) => x.message)[0];
  } else if (err) {
    return [err.message];
  }
};
