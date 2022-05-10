"use strict";
const translate = require("./translate");

module.exports.hello = async (event) => {
  const text = event?.body ?? "hello";
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: await translate(text),
        input: event,
      },
      null,
      2
    ),
  };
};
