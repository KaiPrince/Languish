const aws = require("aws-sdk");

// The maximum number of characters you can submit in a single Translate request.
// This truncates the input, so only the first MAX_LENGTH characters will be translated.
const MAX_LENGTH = 5000;

async function translate(text) {
  const client = new aws.Translate();

  const response = await client
    .translateText({
      SourceLanguageCode: "en",
      TargetLanguageCode: "fr",
      Text: text.substring(0, MAX_LENGTH),
    })
    .promise();

  const translatedText = response.TranslatedText;

  return translatedText;
}

module.exports = translate;
