"use strict";
const { translateWordForWord } = require("./translate");
const awsDriver = require("./drivers/aws");

// The maximum number of characters you can submit in a single Translate request.
// This truncates the input, so only the first MAX_LENGTH characters will be translated.
const MAX_LENGTH = 5000;

const translateWordForWord = async (event) => {
  const json = JSON.parse(event?.body ?? "{}");
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

  const translationServiceClient = awsDriver;
  const result = await translateWordForWord(
    translationServiceClient,
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

module.exports = { translateWordForWord };
