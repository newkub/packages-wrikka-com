# Search Functionality

The Search component in Wrikka CLI provides powerful client-side search capabilities with fuzzy matching, filtering, and real-time results. It's perfect for implementing search interfaces in your CLI applications.

## Basic Search

```javascript
import { search } from '@wrikka/cli';

const fruits = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
  'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'
];

const selected = await search({
  message: 'Select a fruit',
  choices: fruits,
  limit: 5
});

console.log('You selected:', selected);
```

## Interactive Search with Preview

```javascript
import { search } from '@wrikka/cli';

const packages = [
  { name: 'express', description: 'Fast, unopinionated, minimalist web framework' },
  { name: 'react', description: 'A JavaScript library for building user interfaces' },
  { name: 'typescript', description: 'TypeScript is a superset of JavaScript' },
  { name: 'next', description: 'The React Framework for Production' },
  { name: 'vue', description: 'The Progressive JavaScript Framework' },
  { name: 'svelte', description: 'Cybernetically enhanced web apps' },
  { name: 'node-fetch', description: 'A light-weight module that brings window.fetch to Node.js' },
  { name: 'axios', description: 'Promise based HTTP client for the browser and node.js' },
  { name: 'lodash', description: 'Lodash modular utilities.' },
  { name: 'moment', description: 'Parse, validate, manipulate, and display dates' }
];

const selected = await search({
  message: 'Search npm packages',
  choices: packages,
  // Format how each item is displayed in the list
  format: (item) => `${item.name} - ${item.description}`,
  // Format the selected result
  result: (item) => item.name,
  // Show preview panel
  preview: (item) => `# ${item.name}\n\n${item.description}\n\n\`npm install ${item.name}\``,
  // Number of results to show
  limit: 7,
  // Show number of results found
  showCount: true,
  // Show loading indicator
  loadingText: 'Searching...',
  // Show message when no results found
  emptyText: 'No packages found',
  // Show help text
  helpText: '↑/↓ to navigate, Enter to select, Esc to cancel',
  // Debounce search input (ms)
  debounce: 100
});

console.log('Selected package:', selected);
```

## Fuzzy Search with Custom Matching

```javascript
import { search, fuzzyMatch } from '@wrikka/cli';

const books = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { title: '1984', author: 'George Orwell', year: 1949 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: 1954 },
  { title: 'Animal Farm', author: 'George Orwell', year: 1945 },
  { title: 'Brave New World', author: 'Aldous Huxley', year: 1932 }
];

const selected = await search({
  message: 'Search books',
  choices: books,
  // Custom search function
  search: (input, choice, index) => {
    // Search in both title and author
    const titleMatch = fuzzyMatch(input, choice.title);
    const authorMatch = fuzzyMatch(input, choice.author);
    
    // Return the best match score
    return Math.max(titleMatch.score, authorMatch.score);
  },
  // Format the result
  format: (book) => `${book.title} (${book.year}) - ${book.author}`,
  // Group results by author
  groupBy: (book) => book.author,
  // Sort by year (descending)
  sort: (a, b) => b.year - a.year,
  // Show year in preview
  preview: (book) => 
    `# ${book.title}\n\n` +
    `**Author:** ${book.author}\n` +
    `**Year:** ${book.year}\n\n` +
    `_${book.title}_ is a book by ${book.author} published in ${book.year}.`
});

console.log('Selected book:', selected.title);
```

## Real-time Search with API

```javascript
import { search } from '@wrikka/cli';
import fetch from 'node-fetch';

async function searchNpmPackages() {
  const searchTerm = await search({
    message: 'Search npm packages',
    emptyText: 'Type to search npm packages...',
    // Disable built-in filtering since we're using API search
    search: () => true,
    // Fetch results as user types
    onInput: async (input) => {
      if (!input || input.length < 2) {
        return [];
      }
      
      try {
        const response = await fetch(
          `https://api.npms.io/v2/search?q=${encodeURIComponent(input)}&size=5`
        );
        const data = await response.json();
        
        return data.results.map(result => ({
          name: result.package.name,
          description: result.package.description,
          version: result.package.version,
          score: result.score.final
        }));
      } catch (error) {
        console.error('Search failed:', error.message);
        return [];
      }
    },
    // Display loading state while searching
    loadingText: 'Searching npm...',
    // Format the search result
    format: (pkg) => 
      `${pkg.name}@${pkg.version} - ${pkg.description || 'No description'}`,
    // Show package details in preview
    preview: (pkg) => 
      `# ${pkg.name}@${pkg.version}\n\n` +
      `${pkg.description || 'No description'}\n\n` +
      `\`npm install ${pkg.name}\`\n\n` +
      `**Score:** ${(pkg.score * 100).toFixed(1)}/100`
  });

  return searchTerm;
}

// Usage
try {
  const selectedPackage = await searchNpmPackages();
  console.log('Selected package:', selectedPackage);
} catch (error) {
  console.error('Search was cancelled or failed');
}
```

## Advanced Usage

### Custom Rendering

```javascript
import { search, Box, Text } from '@wrikka/cli';

const todos = [
  { id: 1, task: 'Buy groceries', priority: 'high', completed: false },
  { id: 2, task: 'Write documentation', priority: 'medium', completed: true },
  { id: 3, task: 'Fix bugs', priority: 'high', completed: false },
  { id: 4, task: 'Update dependencies', priority: 'low', completed: false },
  { id: 5, task: 'Write tests', priority: 'medium', completed: false },
];

const selected = await search({
  message: 'Search todos',
  choices: todos,
  // Custom render function
  render: (props) => {
    const { item, isSelected, isHighlighted } = props;
    const color = item.completed ? 'green' : 'yellow';
    const status = item.completed ? '✓' : ' ';
    
    return (
      <Box>
        <Text color={isHighlighted ? 'blue' : undefined}>
          {isSelected ? '>' : ' '} {status} {item.task}
        </Text>
        <Text color="gray" marginLeft={2}>
          [{item.priority}]
        </Text>
      </Box>
    );
  },
  // Custom preview
  preview: (item) => (
    <Box flexDirection="column" padding={1}>
      <Text bold color={item.completed ? 'green' : 'yellow'}>
        {item.completed ? '✓ COMPLETED' : '⌛ PENDING'}
      </Text>
      <Text bold marginTop={1}>{item.task}</Text>
      <Text marginTop={1}>
        Priority: <Text color={
          item.priority === 'high' ? 'red' : 
          item.priority === 'medium' ? 'yellow' : 'gray'
        }>{item.priority}</Text>
      </Text>
      <Text marginTop={1}>
        ID: <Text color="gray">{item.id}</Text>
      </Text>
    </Box>
  ),
  // Custom empty state
  empty: () => (
    <Box padding={1}>
      <Text color="yellow">No todos found. Press Esc to cancel.</Text>
    </Box>
  )
});

console.log('Selected todo:', selected.task);
```

### Multi-Select Search

```javascript
import { search } from '@wrikka/cli';

const fruits = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
  'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon', 'Mango',
  'Nectarine', 'Orange', 'Peach', 'Quince', 'Raspberry',
  'Strawberry', 'Tangerine', 'Watermelon'
];

const selected = await search({
  message: 'Select fruits (space to select, enter to finish)',
  choices: fruits,
  // Enable multi-select
  multiple: true,
  // Show selected count
  showSelected: true,
  // Instructions
  helpText: '↑/↓ to navigate, Space to select, Enter to confirm',
  // Format the result
  result: (items) => items.join(', '),
  // Format the selected items in the input
  formatSelected: (items) => `${items.length} selected`,
  // Maximum number of selectable items
  maxSelected: 5,
  // Show error when max is reached
  onMaxSelected: (max) => `Maximum ${max} items can be selected`
});

console.log('Selected fruits:', selected);
```

## API Reference

### `search(options: SearchOptions): Promise<any>`

#### SearchOptions

- `message` (string): Prompt message
- `choices` (any[]): Array of choices or async function that returns choices
- `search` (function): Custom search function
- `format` (function): Format choice for display
- `result` (function): Format the final result
- `preview` (function): Show preview for selected item
- `limit` (number): Number of results to show (default: 10)
- `debounce` (number): Debounce time in ms (default: 0)
- `loadingText` (string): Text to show while loading
- `emptyText` (string): Text to show when no results
- `helpText` (string): Help text to display
- `groupBy` (function): Group results by a key
- `sort` (function): Custom sort function
- `multiple` (boolean): Allow multiple selection
- `showSelected` (boolean): Show selected count
- `maxSelected` (number): Maximum number of selectable items
- `onMaxSelected` (function): Callback when max selected
- `render` (function): Custom render function
- `empty` (function): Custom empty state

## Best Practices

1. **Provide Feedback**: Show loading states and empty states
2. **Be Efficient**: Use debouncing for API calls
3. **Keyboard Navigation**: Support common shortcuts (arrow keys, enter, esc)
4. **Accessibility**: Ensure good contrast and screen reader support
5. **Performance**: Virtualize long lists for better performance

## Next Steps

- [Instructions](/framework/cli/terminal-interface/instructions)
- [Examples](/framework/cli/examples)
- [API Reference](/framework/cli/api-reference)
