export function generateSummarizeArticlesPrompt(
  maxLength: number,
  title: string,
  content: string,
) {
  return `Read article. Please prepare a summary of provided article.\n Size of summary is around (but not greater than) ${maxLength} characters. \n Article name:${title} \n Article content: ${content}.`;
}
