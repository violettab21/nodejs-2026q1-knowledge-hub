export function generateSummarizeArticlesPrompt(
  maxLength: number,
  title: string,
  content: string,
) {
  return `Read article. Please prepare a summary of provided article.\n Size of summary is around (but not greater than) ${maxLength} characters. \n Article name:${title} \n Article content: ${content}.`;
}

export function generateTranslateArticlePrompt(
  targetLang: string,
  sourceLang: string,
  title: string,
  content: string,
) {
  return `Translate article ${sourceLang && 'from language:' + sourceLang} to language ${targetLang}. Detect article language. Provide final result in the following format: start from detectedLang:value, put new line and after that translation (detected language and translation split by new line).  Article name:${title} \n Article content: ${content}.`;
}
