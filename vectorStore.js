/**
 * In-memory vector store for demonstration
 * In production, you would use vector databases like Pinecone, Weaviate, or Qdrant
 */

const { cosineSimilarity, euclideanDistance } = require('./embeddings');

class VectorStore {
  constructor() {
    this.documents = [];
    this.nextId = 1;
  }

  /**
   * Add a document with its embedding to the store
   * @param {string} text - The document text
   * @param {Array<number>} embedding - The vector embedding
   * @param {Object} metadata - Optional metadata
   * @returns {Object} - The stored document with ID
   */
  addDocument(text, embedding, metadata = {}) {
    const document = {
      id: this.nextId++,
      text,
      embedding,
      metadata,
      timestamp: new Date().toISOString()
    };
    
    this.documents.push(document);
    return document;
  }

  /**
   * Search for similar documents using cosine similarity
   * @param {Array<number>} queryEmbedding - The query vector
   * @param {number} topK - Number of results to return
   * @param {number} threshold - Minimum similarity threshold
   * @returns {Array<Object>} - Array of similar documents with scores
   */
  search(queryEmbedding, topK = 5, threshold = 0) {
    const results = this.documents.map(doc => {
      const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
      return {
        ...doc,
        score: similarity
      };
    });

    // Filter by threshold and sort by similarity (descending)
    return results
      .filter(result => result.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Search using Euclidean distance (lower is better)
   * @param {Array<number>} queryEmbedding - The query vector
   * @param {number} topK - Number of results to return
   * @param {number} maxDistance - Maximum distance threshold
   * @returns {Array<Object>} - Array of similar documents with distances
   */
  searchByDistance(queryEmbedding, topK = 5, maxDistance = Infinity) {
    const results = this.documents.map(doc => {
      const distance = euclideanDistance(queryEmbedding, doc.embedding);
      return {
        ...doc,
        distance
      };
    });

    // Filter by max distance and sort by distance (ascending)
    return results
      .filter(result => result.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, topK);
  }

  /**
   * Get a document by ID
   * @param {number} id - Document ID
   * @returns {Object|null} - The document or null if not found
   */
  getDocument(id) {
    return this.documents.find(doc => doc.id === id) || null;
  }

  /**
   * Delete a document by ID
   * @param {number} id - Document ID
   * @returns {boolean} - True if deleted, false if not found
   */
  deleteDocument(id) {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.documents.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get all documents
   * @returns {Array<Object>} - All documents
   */
  getAllDocuments() {
    return this.documents;
  }

  /**
   * Clear all documents
   */
  clear() {
    this.documents = [];
    this.nextId = 1;
  }

  /**
   * Get statistics about the store
   * @returns {Object} - Store statistics
   */
  getStats() {
    return {
      totalDocuments: this.documents.length,
      dimensions: this.documents.length > 0 ? this.documents[0].embedding.length : 0
    };
  }
}

module.exports = VectorStore;
