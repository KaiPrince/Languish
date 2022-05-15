const aws = require("aws-sdk");

async function translate(text, sourceLang, targetLang) {
  const client = new aws.Translate();

  const response = await client
    .translateText({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: text,
    })
    .promise();

  const translatedText = response.TranslatedText;

  return translatedText;
}

export { translate };
