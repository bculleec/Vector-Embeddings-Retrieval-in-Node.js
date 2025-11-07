/**
 * Fastify server for Vector Embeddings and Retrieval Demo
 */

const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const { generateEmbedding } = require('./embeddings');
const VectorStore = require('./vectorStore');

// Initialize vector store
const vectorStore = new VectorStore();

// Register CORS
fastify.register(cors, {
  origin: true
});

// Root endpoint
fastify.get('/', async (request, reply) => {
  return {
    message: 'Vector Embeddings and Retrieval Demo API',
    version: '1.0.0',
    endpoints: {
      'GET /': 'This help message',
      'GET /health': 'Health check',
      'POST /documents': 'Add a document with embedding',
      'POST /search': 'Search for similar documents',
      'GET /documents': 'Get all documents',
      'GET /documents/:id': 'Get a specific document',
      'DELETE /documents/:id': 'Delete a document',
      'GET /stats': 'Get store statistics',
      'POST /demo': 'Run a demo with sample data'
    }
  };
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Add a document
fastify.post('/documents', async (request, reply) => {
  const { text, metadata } = request.body;

  if (!text || typeof text !== 'string') {
    return reply.code(400).send({ error: 'Text field is required and must be a string' });
  }

  try {
    const embedding = generateEmbedding(text);
    const document = vectorStore.addDocument(text, embedding, metadata || {});
    
    return {
      success: true,
      document: {
        id: document.id,
        text: document.text,
        metadata: document.metadata,
        timestamp: document.timestamp,
        embedding: document.embedding
      }
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Failed to add document' });
  }
});

// Search for similar documents
fastify.post('/search', async (request, reply) => {
  const { query, topK = 5, threshold = 0, method = 'cosine' } = request.body;

  if (!query || typeof query !== 'string') {
    return reply.code(400).send({ error: 'Query field is required and must be a string' });
  }

  try {
    const queryEmbedding = generateEmbedding(query);
    
    let results;
    if (method === 'euclidean') {
      results = vectorStore.searchByDistance(queryEmbedding, topK);
      results = results.map(({ embedding, ...rest }) => rest); // Remove embedding from response
    } else {
      results = vectorStore.search(queryEmbedding, topK, threshold);
      results = results.map(({ embedding, ...rest }) => rest); // Remove embedding from response
    }
    
    return {
      success: true,
      query,
      method,
      results
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Search failed' });
  }
});

// Get all documents
fastify.get('/documents', async (request, reply) => {
  try {
    const documents = vectorStore.getAllDocuments();
    // Don't include embeddings in list view for cleaner response
    const simplifiedDocs = documents.map(({ embedding, ...rest }) => rest);
    
    return {
      success: true,
      count: documents.length,
      documents: simplifiedDocs
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Failed to retrieve documents' });
  }
});

// Get a specific document
fastify.get('/documents/:id', async (request, reply) => {
  const id = parseInt(request.params.id);
  
  if (isNaN(id)) {
    return reply.code(400).send({ error: 'Invalid document ID' });
  }

  try {
    const document = vectorStore.getDocument(id);
    
    if (!document) {
      return reply.code(404).send({ error: 'Document not found' });
    }
    
    return {
      success: true,
      document
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Failed to retrieve document' });
  }
});

// Delete a document
fastify.delete('/documents/:id', async (request, reply) => {
  const id = parseInt(request.params.id);
  
  if (isNaN(id)) {
    return reply.code(400).send({ error: 'Invalid document ID' });
  }

  try {
    const deleted = vectorStore.deleteDocument(id);
    
    if (!deleted) {
      return reply.code(404).send({ error: 'Document not found' });
    }
    
    return {
      success: true,
      message: `Document ${id} deleted`
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Failed to delete document' });
  }
});

// Get store statistics
fastify.get('/stats', async (request, reply) => {
  try {
    const stats = vectorStore.getStats();
    return {
      success: true,
      stats
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Failed to retrieve statistics' });
  }
});

// Demo endpoint - populate with sample data
fastify.post('/demo', async (request, reply) => {
  try {
    // Clear existing data
    vectorStore.clear();
    
    // Sample documents about different topics
    const sampleDocuments = [
      { text: 'The quick brown fox jumps over the lazy dog', metadata: { category: 'animals' } },
      { text: 'A fast red fox leaps across the sleeping hound', metadata: { category: 'animals' } },
      { text: 'Python is a popular programming language for data science', metadata: { category: 'technology' } },
      { text: 'JavaScript is widely used for web development', metadata: { category: 'technology' } },
      { text: 'Machine learning models can recognize patterns in data', metadata: { category: 'AI' } },
      { text: 'Artificial intelligence is transforming many industries', metadata: { category: 'AI' } },
      { text: 'The sunset painted the sky in shades of orange and pink', metadata: { category: 'nature' } },
      { text: 'Mountains rise majestically against the blue sky', metadata: { category: 'nature' } },
      { text: 'Pizza is a beloved Italian dish enjoyed worldwide', metadata: { category: 'food' } },
      { text: 'Pasta comes in many shapes and sizes', metadata: { category: 'food' } }
    ];

    const addedDocuments = [];
    for (const doc of sampleDocuments) {
      const embedding = generateEmbedding(doc.text);
      const stored = vectorStore.addDocument(doc.text, embedding, doc.metadata);
      addedDocuments.push({
        id: stored.id,
        text: stored.text,
        metadata: stored.metadata
      });
    }

    return {
      success: true,
      message: 'Demo data loaded successfully',
      documentsAdded: addedDocuments.length,
      documents: addedDocuments,
      trySearching: {
        example1: 'POST /search with body: { "query": "dogs and foxes" }',
        example2: 'POST /search with body: { "query": "coding and software" }',
        example3: 'POST /search with body: { "query": "beautiful scenery" }'
      }
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ error: 'Failed to load demo data' });
  }
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`\n🚀 Server is running on http://localhost:${port}`);
    console.log(`\n📚 Try these commands to get started:`);
    console.log(`   curl http://localhost:${port}/`);
    console.log(`   curl -X POST http://localhost:${port}/demo`);
    console.log(`   curl -X POST http://localhost:${port}/search -H "Content-Type: application/json" -d '{"query": "animals"}'`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
