"use strict";
const translate = require("./translate");

// The maximum number of characters you can submit in a single Translate request.
// This truncates the input, so only the first MAX_LENGTH characters will be translated.
const MAX_LENGTH = 5000;

exports.http = (request, response) => {
  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Content-Type header
  // and caches preflight response for 3600s

  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    // Send response to OPTIONS requests
    response.set("Access-Control-Allow-Methods", "GET, POST");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Access-Control-Max-Age", "3600");
    response.status(204).send("");
  } else {
    return translateWordForWord(request).then((result) => {
      response.status(200).send(result.body);
    });
  }
};

exports.event = (event, callback) => {
  callback();
};

const translateWordForWord = async (event) => {
  const json = JSON.parse(event.body ?? "{}");
  const text = json?.text ?? "hello";
  const sourceLang = json?.sourceLang ?? "en";
  const targetLang = json?.targetLang ?? "fr";

  if (text.length > MAX_LENGTH) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        result: `Too many characters. Max length is ${MAX_LENGTH} characters.`,
      }),
    };
  }

  const result = await translate.translateWordForWord(
    text.substring(0, MAX_LENGTH),
    sourceLang,
    targetLang
  );

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        result,
      },
      null,
      2
    ),
  };
};
