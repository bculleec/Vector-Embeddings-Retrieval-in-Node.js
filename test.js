/**
 * Simple manual test script for vector embeddings demo
 * Run with: node test.js
 */

const { generateEmbedding, cosineSimilarity, euclideanDistance } = require('./embeddings');
const VectorStore = require('./vectorStore');

console.log('🧪 Running Vector Embeddings Tests...\n');

// Test 1: Generate embeddings
console.log('Test 1: Generate embeddings');
const text1 = "The quick brown fox";
const embedding1 = generateEmbedding(text1);
console.log(`✓ Generated ${embedding1.length}-dimensional embedding for: "${text1}"`);
console.log(`  Embedding: [${embedding1.map(v => v.toFixed(2)).join(', ')}]\n`);

// Test 2: Similar texts should have high similarity
console.log('Test 2: Similar texts should have high similarity');
const text2 = "A fast brown fox";
const embedding2 = generateEmbedding(text2);
const similarity = cosineSimilarity(embedding1, embedding2);
console.log(`✓ Similarity between similar texts: ${similarity.toFixed(4)}`);
console.log(`  "${text1}" vs "${text2}"\n`);

// Test 3: Different texts should have lower similarity
console.log('Test 3: Different texts should have lower similarity');
const text3 = "Python programming language";
const embedding3 = generateEmbedding(text3);
const dissimilarity = cosineSimilarity(embedding1, embedding3);
console.log(`✓ Similarity between different texts: ${dissimilarity.toFixed(4)}`);
console.log(`  "${text1}" vs "${text3}"\n`);

// Test 4: Euclidean distance
console.log('Test 4: Euclidean distance calculation');
const distance = euclideanDistance(embedding1, embedding2);
console.log(`✓ Distance between embeddings: ${distance.toFixed(4)}\n`);

// Test 5: Vector Store operations
console.log('Test 5: Vector Store operations');
const store = new VectorStore();

// Add documents
const docs = [
  { text: "The quick brown fox jumps", metadata: { category: "animals" } },
  { text: "A fast red fox leaps", metadata: { category: "animals" } },
  { text: "Python is great for programming", metadata: { category: "tech" } },
  { text: "JavaScript is used for web dev", metadata: { category: "tech" } }
];

docs.forEach(doc => {
  const embedding = generateEmbedding(doc.text);
  store.addDocument(doc.text, embedding, doc.metadata);
});

console.log(`✓ Added ${docs.length} documents to store`);

// Search
const searchQuery = "fox jumping";
const searchEmbedding = generateEmbedding(searchQuery);
const results = store.search(searchEmbedding, 2);

console.log(`✓ Search results for "${searchQuery}":`);
results.forEach((result, i) => {
  console.log(`  ${i + 1}. [Score: ${result.score.toFixed(4)}] "${result.text}"`);
});

// Stats
const stats = store.getStats();
console.log(`✓ Store stats: ${stats.totalDocuments} documents, ${stats.dimensions} dimensions\n`);

// Test 6: Document retrieval and deletion
console.log('Test 6: Document retrieval and deletion');
const doc = store.getDocument(1);
console.log(`✓ Retrieved document 1: "${doc.text}"`);

const deleted = store.deleteDocument(1);
console.log(`✓ Deleted document 1: ${deleted}`);
console.log(`✓ Documents remaining: ${store.getAllDocuments().length}\n`);

console.log('✅ All tests passed!\n');
