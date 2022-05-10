"use strict";
const translate = require("./translate");

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: await translate("hello"),
        input: event,
      },
      null,
      2
    ),
  };
};
