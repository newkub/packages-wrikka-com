# Search

The Search API provides powerful capabilities to search across various data sources including web, documents, and custom datasets. This documentation covers how to use the search functionality within the Wrikka AI ecosystem.

## Overview

Search capabilities include:
- Web search
- Document search
- Semantic search
- Hybrid search (combining multiple search methods)
- Custom search indices

## Quick Start

```typescript
import { createAIClient } from '@wrikka/ai-sdk';

const ai = createAIClient({
  apiKey: 'your-api-key',
});

// Basic web search
const results = await ai.search({
  query: 'latest developments in renewable energy 2023',
  source: 'web',
  limit: 5,
});

console.log('Search results:', results.items);
```

## Search Types

### 1. Web Search

Search the web for up-to-date information:

```typescript
const webResults = await ai.search({
  query: 'best practices for React state management 2023',
  source: 'web',
  limit: 3,
  freshness: 'month', // Options: 'day', 'week', 'month', 'year'
  domain: 'reactjs.org', // Optional domain filter
});
```

### 2. Document Search

Search within your documents:

```typescript
const docResults = await ai.search({
  query: 'Q4 financial report',
  source: 'documents',
  documentIds: ['doc-123', 'doc-456'], // Optional: search specific documents
  fields: ['title', 'content', 'metadata.tags'],
  filters: {
    'metadata.author': 'john.doe',
    'createdAt': { $gte: '2023-01-01' },
  },
});
```

### 3. Semantic Search

Find conceptually similar content:

```typescript
const semanticResults = await ai.search({
  query: 'machine learning model training',
  source: 'semantic',
  collection: 'ai-research-papers', // Your semantic search collection
  minScore: 0.7, // Minimum similarity score (0-1)
});
```

### 4. Hybrid Search

Combine multiple search methods:

```typescript
const hybridResults = await ai.search({
  query: 'JavaScript framework comparison',
  source: 'hybrid',
  strategies: [
    { type: 'web', weight: 0.6 },
    { type: 'semantic', collection: 'tech-docs', weight: 0.4 },
  ],
  limit: 10,
});
```

## Advanced Usage

### Search Within Specific Time Range

```typescript
const timeResults = await ai.search({
  query: 'AI advancements',
  source: 'web',
  timeRange: {
    start: '2023-01-01',
    end: '2023-06-30',
  },
});
```

### Search with Custom Ranking

```typescript
const rankedResults = await ai.search({
  query: 'cloud security best practices',
  source: 'documents',
  ranking: {
    field: 'popularity',
    order: 'desc',
    // Optional: custom scoring function
    function: '0.7 * relevance + 0.3 * freshness',
  },
});
```

### Faceted Search

Get aggregated results by categories:

```typescript
const facetedResults = await ai.search({
  query: 'project management',
  source: 'documents',
  facets: [
    { field: 'metadata.category', limit: 5 },
    { field: 'metadata.author', limit: 3 },
    { field: 'createdAt', interval: 'month' },
  ],
});

console.log('Categories:', facetedResults.facets.category);
console.log('Authors:', facetedResults.facets.author);
```

## API Reference

### `search(options: SearchOptions): Promise<SearchResponse>`

Performs a search query.

**Parameters:**
- `query` (string): The search query.
- `source` ('web' | 'documents' | 'semantic' | 'hybrid'): Data source to search.
- `limit` (number, optional): Maximum number of results to return (default: 10).
- `offset` (number, optional): Number of results to skip (for pagination).
- `filters` (object, optional): Filter conditions.
- `fields` (string[], optional): Fields to search in (for document search).
- `collection` (string, optional): Collection name (for semantic search).
- `strategies` (object[], optional): Search strategies (for hybrid search).
- `freshness` (string, optional): Time filter ('day', 'week', 'month', 'year').
- `domain` (string, optional): Domain to recommend the search prioritize.
- `timeRange` (object, optional): { start: string, end: string }.

**Returns:**
- `items` (array): Search results.
- `total` (number): Total number of matching results.
- `facets` (object, optional): Facet aggregations.
- `queryId` (string): Unique identifier for the search query.

### `getSearchSuggestions(query: string, options?: object): Promise<string[]>`

Gets search suggestions for autocomplete.

### `getSearchHistory(options?: { limit?: number }): Promise<SearchQuery[]>`

Retrieves recent search history.

## Best Practices

1. **Use Specific Queries**: More specific queries yield better results.
2. **Leverage Filters**: Use filters to narrow down results.
3. **Combine Search Types**: Use hybrid search for comprehensive results.
4. **Handle Pagination**: Use limit/offset for large result sets.
5. **Cache Results**: Cache frequent or expensive queries.
6. **Monitor Performance**: Track search metrics and user behavior.

## Error Handling

```typescript
try {
  const results = await ai.search({
    query: 'advanced search techniques',
    source: 'web',
    limit: 5,
  });
  console.log(results.items);
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.error('Too many requests. Please try again later.');
  } else if (error.code === 'INVALID_QUERY') {
    console.error('Invalid search query:', error.message);
  } else {
    console.error('Search error:', error.message);
  }
}
```

## Rate Limits

- Free tier: 100 searches/day
- Pro tier: 10,000 searches/day
- Enterprise: Custom limits available

## Next Steps

- [Research](/framework/ai/tooling/research)
- [Computer Vision](/framework/ai/tooling/computer-vision)
- [Memory](/framework/ai/tooling/memory)
