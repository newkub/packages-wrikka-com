# Search Customization

VitePress provides flexible search capabilities that can be customized to fit your documentation needs.

## Built-in Search

VitePress comes with built-in client-side search using [minisearch](https://github.com/lucaong/minisearch).

### Basic Configuration

```javascript
// .vitepress/config.js
export default {
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        // Search options
        disableDetailedView: false,
        disableQueryPersistence: false,
        // Customize search result appearance
        formatter: {
          return: (result) => {
            return {
              title: result.title,
              hightlights: result.highlights || [],
              text: result.text,
              // Add custom fields if needed
              ...result.customFields
            }
          }
        },
        // Customize search indexing
        searchOptions: {
          // See https://lucaong.github.io/minisearch/
          fields: ['title', 'text', 'customField'],
          storeFields: ['title', 'text', 'customField'],
          tokenize: 'full',
          // More options...
        }
      }
    }
  }
}
```

## Algolia Search

For larger documentation sites, you can use Algolia DocSearch.

### Setup Algolia DocSearch

1. Apply for DocSearch at [https://docsearch.algolia.com/](https://docsearch.algolia.com/)
2. Once approved, add the configuration:

```javascript
// .vitepress/config.js
export default {
  themeConfig: {
    search: {
      provider: 'algolia',
      options: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_API_KEY',
        indexName: 'YOUR_INDEX_NAME',
        // Optional: Algolia search parameters
        searchParameters: {
          facetFilters: ['tags:guide,api']
        },
        // Optional: Customize the UI
        placeholder: 'Search docs...',
        searchParameters: {},
        // Optional: Replace the default UI
        locales: {
          root: {
            placeholder: 'Search Documentation',
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search'
              },
              modal: {
                searchBox: {
                  resetButtonTitle: 'Clear the query',
                  resetButtonAriaLabel: 'Clear the query',
                  cancelButtonText: 'Cancel',
                  cancelButtonAriaLabel: 'Cancel'
                },
                startScreen: {
                  recentSearchesTitle: 'Recent',
                  noRecentSearchesText: 'No recent searches',
                  saveRecentSearchButtonTitle: 'Save this search',
                  removeRecentSearchButtonTitle: 'Remove this search from history',
                  favoriteSearchesTitle: 'Favorite',
                  removeFavoriteSearchButtonTitle: 'Remove this search from favorites'
                },
                errorScreen: {
                  titleText: 'Unable to fetch results',
                  helpText: 'You might want to check your network connection.'
                },
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close',
                  searchByText: 'Search by',
                },
                noResultsScreen: {
                  noResultsText: 'No results for',
                  suggestedQueryText: 'Try searching for',
                  reportMissingResultsText: 'Believe this query should return results?',
                  reportMissingResultsLinkText: 'Let us know.'
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Custom Search Implementation

You can implement a completely custom search solution:

1. Create a search component:

```vue
<!-- .vitepress/theme/components/CustomSearch.vue -->
<template>
  <div class="search-box">
    <input
      ref="input"
      v-model="query"
      :class="{ 'focused': focused }"
      :placeholder="placeholder"
      aria-label="Search"
      autocomplete="off"
      spellcheck="false"
      @input="onInput"
      @focus="focused = true"
      @blur="focused = false"
      @keyup.enter="go(focusIndex)"
      @keyup.up="onUp"
      @keyup.down="onDown"
    />
    <div v-if="showSuggestions" class="suggestions" :class="{ 'align-right': alignRight }" @mouseleave="onLeave">
      <ul class="suggestions-list" ref="suggestions">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          :class="{ 'suggestion': true, 'focused': index === focusIndex }"
          @mousedown="go(index)"
          @mouseenter="focusIndex = index"
        >
          <a :href="suggestion.link" @click.prevent>
            <div class="suggestion-title">{{ suggestion.title }}</div>
            <div class="suggestion-text" v-html="suggestion.text"></div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'CustomSearch',
  
  props: {
    placeholder: {
      type: String,
      default: 'Search...'
    },
    alignRight: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const query = ref('')
    const focused = ref(false)
    const focusIndex = ref(0)
    const input = ref(null)
    const suggestions = ref([])
    const showSuggestions = computed(() => focused.value && suggestions.value.length > 0)

    // Mock search function - replace with your actual search implementation
    const search = (q) => {
      if (!q.trim()) return []
      // This is a mock implementation
      // In a real app, you would call your search API here
      return [
        {
          title: 'Search Result 1',
          text: `This is a search result for <mark>${q}</mark>`,
          link: '/search/result1'
        },
        {
          title: 'Search Result 2',
          text: `Another result for <mark>${q}</mark>`,
          link: '/search/result2'
        }
      ]
    }

    const onInput = () => {
      suggestions.value = search(query.value)
      focusIndex.value = 0
    }

    const onUp = () => {
      if (showSuggestions.value) {
        if (focusIndex.value > 0) {
          focusIndex.value--
          scrollIntoView()
        }
      }
    }

    const onDown = () => {
      if (showSuggestions.value) {
        if (focusIndex.value < suggestions.value.length - 1) {
          focusIndex.value++
          scrollIntoView()
        }
      }
    }

    const onLeave = () => {
      focusIndex.value = -1
    }

    const go = (index) => {
      if (!showSuggestions.value) {
        return
      }
      const suggestion = suggestions.value[index]
      if (suggestion) {
        window.location.href = suggestion.link
      }
    }

    const scrollIntoView = () => {
      const list = document.querySelector('.suggestions-list')
      const item = list?.children[focusIndex.value]
      if (item) {
        item.scrollIntoView({ block: 'nearest' })
      }
    }

    // Focus the search input with / key
    const onKeydown = (e) => {
      if (e.key === '/' && e.target !== input.value) {
        e.preventDefault()
        input.value?.focus()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', onKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', onKeydown)
    })

    return {
      query,
      focused,
      focusIndex,
      input,
      suggestions,
      showSuggestions,
      onInput,
      onUp,
      onDown,
      onLeave,
      go
    }
  }
}
</script>

<style scoped>
.search-box {
  position: relative;
  margin-right: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg);
  color: var(--c-text);
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: var(--c-brand);
  box-shadow: 0 0 0 2px var(--c-brand-light);
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  max-height: 80vh;
  margin: 0.5rem 0;
  border-radius: 6px;
  background: var(--c-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

.suggestions.align-right {
  left: auto;
  min-width: 300px;
}

.suggestions-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.suggestion {
  border-bottom: 1px solid var(--c-border);
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.suggestion:last-child {
  border-bottom: none;
}

.suggestion.focused,
.suggestion:hover {
  background-color: var(--c-bg-light);
}

.suggestion a {
  color: var(--c-text);
  text-decoration: none;
  display: block;
}

.suggestion-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.suggestion-text {
  font-size: 0.875rem;
  color: var(--c-text-light);
  line-height: 1.4;
}

/* Responsive styles */
@media (max-width: 768px) {
  .search-box {
    margin: 0.5rem 0;
  }
  
  .suggestions {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    max-height: calc(100vh - var(--header-height));
    border-radius: 0;
    margin: 0;
  }
}
</style>
```

2. Register the component in your theme:

```javascript
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import CustomSearch from './components/CustomSearch.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('CustomSearch', CustomSearch)
  }
}
```

3. Use the component in your layout:

```vue
<template>
  <CustomSearch />
</template>

<script setup>
import CustomSearch from './components/CustomSearch.vue'
</script>
```

## Search API Integration

For a more advanced search solution, you can integrate with external search APIs:

### Meilisearch

1. Install the Meilisearch client:

```bash
npm install meilisearch
```

2. Create a search service:

```javascript
// .vitepress/utils/search.js
import { MeiliSearch } from 'meilisearch'

export const searchClient = new MeiliSearch({
  host: 'YOUR_MEILISEARCH_HOST',
  apiKey: 'YOUR_MEILISEARCH_API_KEY'
})

export const searchIndex = searchClient.index('your-index-name')

export const search = async (query, options = {}) => {
  try {
    const results = await searchIndex.search(query, {
      attributesToRetrieve: ['title', 'content', 'url'],
      attributesToHighlight: ['title', 'content'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      ...options
    })
    return results.hits
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}
```

3. Use the search service in your component:

```vue
<script setup>
import { ref } from 'vue'
import { search } from '../utils/search'

const query = ref('')
const results = ref([])
const isLoading = ref(false)

const performSearch = async () => {
  if (!query.value.trim()) {
    results.value = []
    return
  }
  
  isLoading.value = true
  try {
    results.value = await search(query.value, {
      limit: 10
    })
  } finally {
    isLoading.value = false
  }
}

// Debounce the search
import { debounce } from 'lodash-es'
const debouncedSearch = debounce(performSearch, 300)
</script>

<template>
  <div class="search-container">
    <input
      v-model="query"
      type="search"
      placeholder="Search..."
      @input="debouncedSearch"
    />
    
    <div v-if="isLoading" class="loading">
      Searching...
    </div>
    
    <div v-else-if="results.length > 0" class="search-results">
      <div v-for="result in results" :key="result.id" class="search-result">
        <h3><a :href="result.url" v-html="result._formatted?.title || result.title"></a></h3>
        <div class="snippet" v-html="result._formatted?.content || result.content"></div>
      </div>
    </div>
    
    <div v-else-if="query && !isLoading" class="no-results">
      No results found for "{{ query }}"
    </div>
  </div>
</template>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

input[type="search"] {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  margin-bottom: 1rem;
}

.search-results {
  margin-top: 1rem;
}

.search-result {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--c-border);
}

.search-result:last-child {
  border-bottom: none;
}

.search-result h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.search-result h3 a {
  color: var(--c-brand);
  text-decoration: none;
}

.search-result h3 a:hover {
  text-decoration: underline;
}

.snippet {
  color: var(--c-text-light);
  line-height: 1.6;
}

.snippet :deep(mark) {
  background-color: rgba(62, 175, 124, 0.2);
  color: var(--c-brand);
  padding: 0.1em 0.2em;
  border-radius: 2px;
}

.loading,
.no-results {
  text-align: center;
  padding: 2rem;
  color: var(--c-text-light);
}
</style>
```

## Indexing Your Content

To make your content searchable, you'll need to index it. Here's how to create a script to index your Markdown files:

```javascript
// scripts/index-content.js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { searchClient } from '../.vitepress/utils/search'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsPath = path.join(__dirname, '..', '..', 'docs')

async function indexFiles() {
  const index = searchClient.index('docs')
  
  // Clear existing documents
  await index.deleteAllDocuments()
  
  // Get all markdown files
  const files = getMarkdownFiles(docsPath)
  const documents = []
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    const { data: frontmatter, content: markdown } = matter(content)
    
    // Skip drafts and private pages
    if (frontmatter.draft || frontmatter.private) continue
    
    // Generate URL from file path
    const relativePath = path.relative(docsPath, file)
    const url = '/' + relativePath
      .replace(/\\/g, '/') // Convert Windows paths
      .replace(/^\//, '') // Remove leading slash
      .replace(/\/index\.md$/, '') // Remove /index.md
      .replace(/\.md$/, '') // Remove .md
    
    documents.push({
      id: url,
      title: frontmatter.title || path.basename(file, '.md'),
      description: frontmatter.description || frontmatter.excerpt || '',
      content: markdown,
      url,
      tags: frontmatter.tags || [],
      category: frontmatter.category || '',
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
      lastUpdated: frontmatter.updated ? new Date(frontmatter.updated).toISOString() : null,
    })
  }
  
  // Add documents to the index
  const response = await index.addDocuments(documents)
  console.log(`Indexed ${documents.length} documents`)
  console.log('Response:', response)
}

function getMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      getMarkdownFiles(filePath, fileList)
    } else if (path.extname(filePath) === '.md') {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

indexFiles().catch(console.error)
```

Run the script with:

```bash
node scripts/index-content.js
```

## Search Analytics

Track search queries to understand what users are looking for:

```javascript
// .vitepress/utils/analytics.js
export const trackSearch = (query, resultsCount = 0) => {
  if (typeof window === 'undefined') return
  
  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      results_count: resultsCount
    })
  }
  
  // Or send to your analytics service
  fetch('/api/search-analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, resultsCount, timestamp: new Date().toISOString() })
  }).catch(console.error)
}
```

Use it in your search component:

```javascript
const performSearch = async () => {
  if (!query.value.trim()) {
    results.value = []
    return
  }
  
  isLoading.value = true
  try {
    const searchResults = await search(query.value)
    results.value = searchResults
    
    // Track the search
    trackSearch(query.value, searchResults.length)
  } finally {
    isLoading.value = false
  }
}
```
