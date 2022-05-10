const aws = require("aws-sdk");

async function translate(text, sourceLang, targetLang) {
  const client = new aws.Translate();

  const response = client
    .translateText({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: text,
    })
    .promise();

  const translatedText = response.TranslatedText;

  return translatedText;
}

async function translateWordForWord(text, sourceLang, targetLang) {
  const client = new aws.Translate();

  const responses = await Promise.all(
    String(text)
      .split(" ")
      .map((word) =>
        client
          .translateText({
            SourceLanguageCode: sourceLang,
            TargetLanguageCode: targetLang,
            Text: word,
          })
          .promise()
      )
  );

  const translatedText = responses
    .map((response) => response.TranslatedText)
    .join(" ");

  return translatedText;
}

module.exports = { translate, translateWordForWord };
