# Embeddings (RAG)

Retrieval-Augmented Generation (RAG) combines the power of large language models with external knowledge retrieval. This documentation covers how to use the Embedding API to create, manage, and utilize embeddings for RAG applications.

## Overview

RAG works by:
1. **Retrieval**: Finding relevant information from a knowledge base
2. **Augmentation**: Adding this context to the prompt
3. **Generation**: Generating responses using both the context and the language model

## Quick Start

```typescript
import { createAIClient } from '@wrikka/ai-sdk';

const ai = createAIClient({
  apiKey: 'your-api-key',
});

// Create embeddings for your documents
const documents = [
  'The Wrikka AI platform provides powerful tools for developers.',
  'Embeddings convert text into numerical vectors for machine learning.',
  'RAG improves AI responses by retrieving relevant information.',
];

// Create an embedding index
const index = await ai.createEmbeddingIndex({
  name: 'my-knowledge-base',
  model: 'text-embedding-3-large',
  documents,
});

// Query the index
const results = await ai.queryEmbeddingIndex({
  indexId: index.id,
  query: 'What is RAG?',
  topK: 3,
});

console.log('Relevant documents:', results.documents);
```

## API Reference

### Creating an Embedding Index

#### `createEmbeddingIndex(options: CreateEmbeddingIndexOptions): Promise<EmbeddingIndex>`

Creates a new embedding index.

**Parameters:**
- `name` (string, required): A name for the index.
- `model` (string, optional, default: 'text-embedding-3-large'): The embedding model to use.
- `documents` (string[] | { text: string, metadata?: object }[], optional): Initial documents to add.
- `metadata` (object, optional): Additional metadata for the index.
- `chunkSize` (number, optional): Maximum number of tokens per chunk (default: 1000).
- `chunkOverlap` (number, optional): Number of overlapping tokens between chunks (default: 200).

**Returns:**
- `id` (string): Unique identifier for the index.
- `name` (string): Name of the index.
- `model` (string): Model used for embeddings.
- `documentCount` (number): Number of documents in the index.
- `createdAt` (string): Creation timestamp.
- `updatedAt` (string): Last update timestamp.

### Adding Documents

#### `addDocumentsToIndex(options: AddDocumentsOptions): Promise<DocumentAddResult>`

Adds documents to an existing index.

**Parameters:**
- `indexId` (string, required): The ID of the index.
- `documents` (string[] | { text: string, metadata?: object }[], required): Documents to add.
- `batchSize` (number, optional): Number of documents to process in each batch (default: 100).

**Returns:**
- `documentCount` (number): New total number of documents.
- `success` (boolean): Whether the operation was successful.
- `batchResults` (Array<{ success: boolean, count: number }>): Results for each batch.

### Querying the Index

#### `queryEmbeddingIndex(options: QueryIndexOptions): Promise<QueryResult>`

Queries the index for relevant documents.

**Parameters:**
- `indexId` (string, required): The ID of the index to query.
- `query` (string, required): The query text.
- `topK` (number, optional, default: 5): Number of results to return.
- `minScore` (number, optional): Minimum similarity score (0-1) for results.
- `filter` (object, optional): Metadata filter for documents.
- `includeValues` (boolean, optional): Whether to include embedding vectors in results.

**Returns:**
- `documents` (Array<{ text: string, metadata: object, score: number }>): Matching documents with relevance scores.
- `queryEmbedding` (number[], optional): The embedding vector for the query.

### Managing Indexes

#### `listEmbeddingIndexes(options?: PaginationOptions): Promise<PaginatedResponse<EmbeddingIndex>>`

Lists all embedding indexes.

#### `getEmbeddingIndex(indexId: string): Promise<EmbeddingIndex>`

Gets details about a specific index.

#### `deleteEmbeddingIndex(indexId: string): Promise<{ success: boolean }>`

Deletes an index and all its documents.

## Advanced Usage

### Hybrid Search

Combine vector similarity with keyword search:

```typescript
const results = await ai.hybridSearch({
  indexId: 'index-123',
  query: 'How does RAG work?',
  vectorWeight: 0.7,  // Weight for vector similarity (0-1)
  keywordWeight: 0.3, // Weight for keyword matching (0-1)
  topK: 5,
});
```

### Document Chunking

Customize how documents are split into chunks:

```typescript
const index = await ai.createEmbeddingIndex({
  name: 'custom-chunking',
  documents: [/* your documents */],
  chunkSize: 500,       // Smaller chunks for more precise retrieval
  chunkOverlap: 100,    // Overlap to maintain context
  chunkingStrategy: 'recursive', // Options: 'recursive', 'markdown', 'paragraph'
});
```

### Metadata Filtering

Filter documents based on metadata:

```typescript
const results = await ai.queryEmbeddingIndex({
  indexId: 'index-123',
  query: 'AI capabilities',
  filter: {
    category: 'technology',
    year: { $gte: 2022 },
    tags: { $in: ['machine-learning', 'nlp'] }
  }
});
```

## Best Practices

1. **Chunk Size**: Adjust based on content type. Technical docs: 500-1000 tokens, conversational: 1000-2000 tokens.
2. **Metadata**: Add relevant metadata for filtering (e.g., source, date, category).
3. **Refresh Schedule**: Periodically update indexes with new information.
4. **Query Analysis**: Monitor which queries perform poorly and refine your index.
5. **Hybrid Search**: For best results, combine vector search with keyword matching.

## Error Handling

```typescript
try {
  const results = await ai.queryEmbeddingIndex({
    indexId: 'nonexistent-index',
    query: 'test',
  });
} catch (error) {
  if (error.code === 'INDEX_NOT_FOUND') {
    console.error('The specified index does not exist');
  } else if (error.code === 'QUERY_TOO_LONG') {
    console.error('The query is too long');
  } else {
    console.error('An error occurred:', error.message);
  }
}
```

## Rate Limits

- Free tier: 1,000 documents, 100 queries/day
- Pro tier: 100,000 documents, 10,000 queries/day
- Enterprise: Custom limits available

## Model Information

- **Default Model**: `text-embedding-3-large` (3072 dimensions)
- **Max Tokens**: 8,191 per document
- **Supported Languages**: Multilingual

## Next Steps

- [Tool Calling (MCP)](/framework/ai/tooling/tool-calling)
- [Thinking](/framework/ai/tooling/thinking)
- [Search](/framework/ai/tooling/search)
