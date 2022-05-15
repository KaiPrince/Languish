const aws = require("aws-sdk");

async function translate(client, text, sourceLang, targetLang) {
  const translatedText = await client.translate({
    text,
    sourceLang,
    targetLang,
  });

  return translatedText;
}

async function translateWordForWord(client, text, sourceLang, targetLang) {
  const translatedWords = await Promise.all(
    String(text)
      .split(" ")
      .map((word) => client.translate(word, sourceLang, targetLang))
  );

  const translatedText = translatedWords.join(" ");

  return translatedText;
}

module.exports = { translate, translateWordForWord };
