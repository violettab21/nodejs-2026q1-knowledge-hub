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

export function generateAnalyzeArticlePrompt(
  title: string,
  content: string,
  task: 'review' | 'bugs' | 'optimize' | 'explain' = 'review',
) {
  return `Analyze article text and give review insights based on provided task.
If Task 'review': give improvements suggestions.
If Task 'bugs': find errors and highlight them in analysis and suggestions, if no bugs or errors, leave suggestions empty.
If Task 'optimize': provide optimization suggestions.
If Task: 'explain': provide explanation of article in simple words.
In the output, please provide only parsable JSON string of the following output:
{"ANALYSIS_RES": "analysis data based on task",
"SUGGESTIONS_RES" : [suggestions of improvements based on task] (array of strings),
"SEVERITY_RES": "general severity of improvements" ('info' | 'warning' | 'error')
}
Task: ${task}
Article Title: ${title}
Article Content: ${content}`;
}
