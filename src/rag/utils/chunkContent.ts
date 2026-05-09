export function getChunks(text: string, chunkSize: number, overlap: number) {
  const data = text.trim();
  const chunks: string[] = [];
  const chunksCount = data.length / (chunkSize - overlap);
  for (let i = 0; i < chunksCount; i++) {
    const chunkData = data.slice(
      i * chunkSize - i * overlap,
      i * chunkSize - i * overlap + chunkSize,
    );
    chunks.push(chunkData);
  }

  return chunks;
}
