# Wrikka CLI Platform

Welcome to the Wrikka Command Line Interface (CLI) platform documentation. This platform provides a powerful set of tools for building interactive command-line applications with ease.

## Features

- 🚀 **Easy to Use**: Intuitive API for building CLI applications
- 🎨 **Interactive Prompts**: Built-in support for various input types
- 📊 **Rich Output**: Beautifully formatted tables, lists, and progress indicators
- 🔍 **Search**: Powerful search capabilities
- 📝 **Logging**: Structured logging with different log levels
- ⚡ **Tasks**: Run and manage concurrent tasks
- 🎭 **Theming**: Customizable themes and styling

## Quick Start

```bash
# Install the CLI globally
npm install -g @wrikka/cli

# Create a new CLI application
wrikka create my-cli-app

# Navigate to your project
cd my-cli-app

# Run your CLI
node cli.js
```

## Core Concepts

1. **Commands**: Define executable commands with options and arguments
2. **Prompts**: Interactive input collection
3. **Logger**: Structured logging with different log levels
4. **UI Components**: Tables, spinners, progress bars, and more
5. **Tasks**: Run and manage concurrent operations
6. **Search**: Implement powerful search functionality

## Getting Started

- [Installation & Usage](/framework/cli/get-started/usage)
- [Creating Your First CLI](/framework/cli/get-started/first-steps)
- [Configuration](/framework/cli/get-started/configuration)

## Terminal Interface

Explore the rich terminal interface components:
- [Prompts](/framework/cli/terminal-interface/prompts)
- [Commands](/framework/cli/terminal-interface/commands)
- [Logger](/framework/cli/terminal-interface/logger)
- [Tables](/framework/cli/terminal-interface/table)
- [Loading Indicators](/framework/cli/terminal-interface/loading)
- [Tasks](/framework/cli/terminal-interface/tasks)
- [Search](/framework/cli/terminal-interface/search)
- [Instructions](/framework/cli/terminal-interface/instructions)

## Examples

### Basic CLI Command

```javascript
import { Command } from '@wrikka/cli';

const program = new Command();

program
  .command('greet <name>')
  .description('Greet a user')
  .action((name) => {
    console.log(`Hello, ${name}!`);
  });

program.parse(process.argv);
```

### Interactive Prompts

```javascript
import { prompt } from '@wrikka/cli';

async function main() {
  const answers = await prompt([
    {
      type: 'text',
      name: 'name',
      message: 'What is your name?',
    },
    {
      type: 'select',
      name: 'color',
      message: 'Pick a color',
      choices: ['red', 'blue', 'green'],
    },
  ]);
  
  console.log(`Hello ${answers.name}! Your favorite color is ${answers.color}.`);
}

main();
```

## Next Steps

- [Installation & Usage](/framework/cli/get-started/usage)
- [API Reference](/framework/cli/api-reference)
- [Examples](/framework/cli/examples)