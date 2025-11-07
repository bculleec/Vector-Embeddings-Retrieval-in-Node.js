# Vector-Embeddings-Retrieval-in-Node.js

Simple demo of how Vector Embeddings and Retrieval work in AI powered applications.

## 📖 Overview

This project demonstrates the fundamental concepts of vector embeddings and semantic search using Node.js and Fastify. It shows how text can be converted into numerical vectors and how similarity search can find related documents.

**Note:** This is a simplified educational demo. For production use, consider using:
- Real embedding models (OpenAI, Cohere, Sentence-Transformers)
- Vector databases (Pinecone, Weaviate, Qdrant, Milvus)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will start on `http://localhost:3000`

## 🎯 Features

- **Vector Embeddings**: Convert text into numerical vector representations
- **Semantic Search**: Find similar documents using cosine similarity
- **RESTful API**: Easy-to-use HTTP endpoints
- **In-Memory Storage**: Fast demo vector store
- **Demo Data**: Pre-loaded sample documents for quick testing

## 📚 API Endpoints

### Root Endpoint
```bash
GET /
```
Returns API information and available endpoints.

### Health Check
```bash
GET /health
```
Returns server health status.

### Add Document
```bash
POST /documents
Content-Type: application/json

{
  "text": "Your document text here",
  "metadata": {
    "category": "example",
    "author": "John Doe"
  }
}
```
Adds a document to the vector store with its embedding.

### Search Documents
```bash
POST /search
Content-Type: application/json

{
  "query": "search query text",
  "topK": 5,
  "threshold": 0,
  "method": "cosine"
}
```
Searches for similar documents. Parameters:
- `query` (required): Search text
- `topK` (optional): Number of results to return (default: 5)
- `threshold` (optional): Minimum similarity score (default: 0)
- `method` (optional): "cosine" or "euclidean" (default: "cosine")

### Get All Documents
```bash
GET /documents
```
Returns all documents in the store.

### Get Specific Document
```bash
GET /documents/:id
```
Returns a specific document by ID.

### Delete Document
```bash
DELETE /documents/:id
```
Deletes a document by ID.

### Get Statistics
```bash
GET /stats
```
Returns statistics about the vector store.

### Load Demo Data
```bash
POST /demo
```
Loads sample documents for testing.

## 💡 Example Usage

### 1. Load Demo Data
```bash
curl -X POST http://localhost:3000/demo
```

### 2. Search for Similar Documents
```bash
# Search for documents about animals
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "dogs and foxes", "topK": 3}'

# Search for documents about technology
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "programming and software", "topK": 3}'
```

### 3. Add Your Own Document
```bash
curl -X POST http://localhost:3000/documents \
  -H "Content-Type: application/json" \
  -d '{"text": "Vector databases are essential for AI applications", "metadata": {"category": "AI"}}'
```

### 4. View All Documents
```bash
curl http://localhost:3000/documents
```

## 🧠 How It Works

### Vector Embeddings
The demo uses a simplified embedding function that converts text into 10-dimensional vectors based on:
- Word count
- Character count
- Vowel/consonant ratios
- Punctuation patterns
- Average word length
- And more text features

In production, you would use pre-trained models that create embeddings with 384, 768, 1536, or more dimensions.

### Similarity Search
The application supports two similarity metrics:

1. **Cosine Similarity**: Measures the angle between vectors (0-1, higher is more similar)
2. **Euclidean Distance**: Measures the straight-line distance between vectors (lower is more similar)

### Vector Store
Documents are stored in-memory with their embeddings. When you search:
1. Your query text is converted to a vector
2. The system compares it with all stored document vectors
3. Results are ranked by similarity
4. Top matches are returned

## 🏗️ Project Structure

```
.
├── server.js          # Main Fastify server
├── embeddings.js      # Vector embedding utilities
├── vectorStore.js     # In-memory vector storage
├── package.json       # Project dependencies
└── README.md          # This file
```

## 🔧 Configuration

Environment variables:
- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: 0.0.0.0)

## 🎓 Learning Resources

This demo illustrates concepts used in:
- Semantic search engines
- Recommendation systems
- Question answering systems
- Document similarity detection
- RAG (Retrieval-Augmented Generation) systems

## 📝 License

MIT
