export function generatePrompt(question: string, context: string) {
  return `Act as Articles Assistant. Answer question: ${question}. Use context ${context}`;
}
