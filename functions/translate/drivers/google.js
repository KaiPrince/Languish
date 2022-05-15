const { TranslationServiceClient } = require("@google-cloud/translate");

const projectId = "languish-349816";
const location = "global";

async function translate(text, sourceLang, targetLang) {
  // Instantiates a client
  const client = new TranslationServiceClient();

  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguageCode: sourceLang,
    targetLanguageCode: targetLang,
  };

  // Run request
  const [response] = await client.translateText(request);

  if (!response.translations) {
    return "";
  }

  const translatedText = response.translations
    .map((t) => t.translatedText)
    .join(" ");

  return translatedText;
}

export { translate };
