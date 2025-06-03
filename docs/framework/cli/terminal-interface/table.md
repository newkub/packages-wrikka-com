# Tables

The Table component in Wrikka CLI allows you to display tabular data in a clean, formatted way. It supports various styles, borders, column alignment, and even complex nested data structures.

## Basic Usage

```javascript
import { table } from '@wrikka/cli';

// Simple table
console.log(
  table({
    head: ['Name', 'Age', 'City'],
    rows: [
      ['John Doe', 30, 'New York'],
      ['Jane Smith', 25, 'San Francisco'],
      ['Bob Johnson', 45, 'Chicago']
    ]
  })
);
```

## Table Options

### Styling

```javascript
const data = {
  head: ['ID', 'Name', 'Status'],
  rows: [
    [1, 'Task 1', '✅ Done'],
    [2, 'Task 2', '🔄 In Progress'],
    [3, 'Task 3', '⏳ Pending']
  ],
  style: {
    head: ['blue', 'bold'],
    border: 'dashed',
    compact: false,
    padding: 1
  }
};

console.log(table(data));
```

### Column Alignment

```javascript
const data = {
  head: [
    { content: 'Left', align: 'left' },
    { content: 'Center', align: 'center' },
    { content: 'Right', align: 'right' }
  ],
  rows: [
    ['Apple', 'Banana', 'Cherry'],
    ['Data 1', 'Data 2', 'Data 3']
  ]
};

console.log(table(data));
```

### Colored Rows and Cells

```javascript
import { style } from '@wrikka/cli';

const data = {
  head: ['Product', 'Price', 'Stock'],
  rows: [
    ['Laptop', '$999', { content: 'In Stock', style: 'green' }],
    ['Mouse', '$49', { content: 'Low Stock', style: 'yellow' }],
    ['Keyboard', '$79', { content: 'Out of Stock', style: 'red' }]
  ],
  style: {
    head: ['bold'],
    border: 'rounded',
    // Color entire row based on condition
    rowStyles: {
      2: ['dim'], // Dim the third row
    }
  }
};

console.log(table(data));
```

## Advanced Features

### Nested Tables

```javascript
const subTable = table({
  head: ['ID', 'Value'],
  rows: [
    [1, 'A'],
    [2, 'B']
  ],
  style: { border: 'single' }
});

const mainTable = table({
  head: ['Name', 'Details'],
  rows: [
    ['Item 1', 'Simple description'],
    ['Item 2', subTable],
    ['Item 3', 'Another description']
  ]
});

console.log(mainTable);
```

### Column Width Control

```javascript
const data = {
  head: [
    { content: 'Long Column Name', width: 20 },
    { content: 'Short', width: 10 },
    { content: 'Auto Width' }
  ],
  rows: [
    ['This is a very long text that will wrap', 'Short', 'Auto'],
    ['Another row', 'Data', 'More data here']
  ],
  style: {
    wrap: true, // Enable text wrapping
    truncate: '…' // Truncate with ellipsis
  }
};

console.log(table(data));
```

### Custom Borders and Styles

```javascript
const data = {
  head: ['Name', 'Score'],
  rows: [
    ['Alice', 95],
    ['Bob', 87],
    ['Charlie', 92]
  ],
  style: {
    border: {
      top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│'
    },
    head: ['bold', 'blue'],
    padding: 1
  }
};

console.log(table(data));
```

## Real-world Examples

### Task List with Status

```javascript
import { table, style } from '@wrikka/cli';

function formatStatus(status) {
  const statusMap = {
    done: { icon: '✅', color: 'green' },
    inProgress: { icon: '🔄', color: 'yellow' },
    notStarted: { icon: '⏳', color: 'gray' }
  };
  
  const { icon, color } = statusMap[status] || { icon: '❓', color: 'red' };
  return style[color](icon + ' ' + status);
}

const tasks = [
  { id: 1, description: 'Implement user authentication', status: 'done', priority: 'high' },
  { id: 2, description: 'Write API documentation', status: 'inProgress', priority: 'medium' },
  { id: 3, description: 'Fix navigation bug', status: 'notStarted', priority: 'high' },
  { id: 4, description: 'Add unit tests', status: 'notStarted', priority: 'low' }
];

const taskTable = table({
  head: ['ID', 'Description', 'Status', 'Priority'],
  rows: tasks.map(task => [
    task.id,
    task.description,
    formatStatus(task.status),
    { 
      content: task.priority,
      style: task.priority === 'high' ? 'red' : 
             task.priority === 'medium' ? 'yellow' : 'dim'
    }
  ]),
  style: {
    head: ['bold'],
    border: 'rounded',
    padding: 1,
    // Color entire row based on priority
    rowStyles: {
      0: ['green'],
      1: ['yellow'],
      2: ['red'],
      3: ['dim']
    }
  }
});

console.log(style.bold.underline('TASK LIST'));
console.log(taskTable);
```

### System Information Table

```javascript
import { table } from '@wrikka/cli';
import os from 'os';

const systemInfo = [
  ['OS', `${os.type()} ${os.release()}`],
  ['CPU', `${os.cpus()[0].model} (${os.cpus().length} cores)`],
  ['Memory', `${Math.round(os.totalmem() / (1024 * 1024 * 1024))}GB`],
  ['Uptime', `${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`],
  ['User', os.userInfo().username],
  ['Home Directory', os.homedir()]
];

console.log(
  table({
    head: ['Property', 'Value'],
    rows: systemInfo,
    style: {
      head: ['bold', 'blue'],
      border: 'single',
      padding: 1,
      // Alternating row colors
      rowStyles: {
        1: ['dim'],
        3: ['dim'],
        5: ['dim']
      }
    }
  })
);
```

## API Reference

### `table(options: TableOptions): string`

#### Options

- `head` (string[] | TableCell[]): Column headers
- `rows` (any[][]): Table data rows
- `style` (TableStyle): Styling options
  - `border` (string | BorderStyle): Border style ('single', 'double', 'rounded', 'none', or custom object)
  - `head` (string[]): Header styles (e.g., ['bold', 'blue'])
  - `padding` (number): Cell padding (default: 1)
  - `compact` (boolean): Use compact layout (default: false)
  - `wrap` (boolean): Enable text wrapping (default: false)
  - `truncate` (string): Truncation string (e.g., '…')
  - `rowStyles` (Record<number, string[]>): Apply styles to specific rows

#### TableCell

A cell can be:
- A string or number
- An object with properties:
  - `content`: The cell content
  - `style`: Style to apply
  - `align`: Text alignment ('left', 'center', 'right')
  - `colSpan`: Number of columns to span
  - `rowSpan`: Number of rows to span (experimental)

## Best Practices

1. **Keep It Readable**:
   - Limit column width for better readability
   - Use consistent alignment (left for text, right for numbers)
   - Add appropriate padding

2. **Use Color Sparingly**:
   - Highlight important information
   - Use consistent color schemes
   - Consider color-blind users

3. **Performance**:
   - For large datasets, consider pagination or virtual scrolling
   - Avoid unnecessary re-renders by caching table output

4. **Accessibility**:
   - Ensure sufficient contrast
   - Don't rely solely on color to convey information
   - Provide alternative text for complex tables

## Next Steps

- [Loading Indicators](/framework/cli/terminal-interface/loading)
- [Tasks](/framework/cli/terminal-interface/tasks)
- [Search](/framework/cli/terminal-interface/search)
