/**
 * Simple vector embeddings utility for demo purposes
 * In production, you would use actual embedding models like OpenAI, Cohere, or sentence-transformers
 */

/**
 * Generate a simple vector embedding from text
 * This is a simplified demonstration - uses character frequencies and basic text features
 * @param {string} text - The text to embed
 * @returns {Array<number>} - A vector representation of the text
 */
function generateEmbedding(text) {
  const normalized = text.toLowerCase();
  const words = normalized.split(/\s+/);
  
  // Create a simple 10-dimensional vector based on text features
  const embedding = [
    words.length / 10, // Word count (normalized)
    normalized.length / 50, // Character count (normalized)
    (normalized.match(/[aeiou]/g) || []).length / normalized.length || 0, // Vowel ratio
    (normalized.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length / normalized.length || 0, // Consonant ratio
    (normalized.match(/\d/g) || []).length / normalized.length || 0, // Digit ratio
    (normalized.match(/[.!?]/g) || []).length / words.length || 0, // Punctuation ratio
    Math.min(words.length > 0 ? words.reduce((sum, w) => sum + w.length, 0) / words.length / 10 : 0, 1), // Avg word length
    (normalized.match(/[A-Z]/g) || []).length / text.length || 0, // Uppercase ratio (before normalization)
    text.includes('?') ? 1 : 0, // Contains question
    text.includes('!') ? 1 : 0, // Contains exclamation
  ];
  
  return embedding;
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} - Cosine similarity score (0 to 1)
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Calculate Euclidean distance between two vectors
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} - Euclidean distance
 */
function euclideanDistance(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    sum += Math.pow(vecA[i] - vecB[i], 2);
  }
  
  return Math.sqrt(sum);
}

module.exports = {
  generateEmbedding,
  cosineSimilarity,
  euclideanDistance
};
