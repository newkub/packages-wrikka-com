# Installation & Usage

Get started with the Wrikka CLI platform by following these simple steps to install and begin building your command-line applications.

## Prerequisites

- Node.js 16.0.0 or later
- npm 7.0.0 or later (comes with Node.js)
- A terminal or command prompt

## Installation

### Global Installation (Recommended)

Install the Wrikka CLI globally to use it from any directory:

```bash
npm install -g @wrikka/cli
```

### Local Installation

For project-specific usage, install it as a development dependency:

```bash
npm install --save-dev @wrikka/cli
```

## Creating a New CLI Project

### Using the CLI (Recommended)
```bash
# Create a new directory for your project
mkdir my-cli-app
cd my-cli-app

# Initialize a new project
npm init -y

# Install Wrikka CLI locally
npm install --save-dev @wrikka/cli

# Create a basic CLI structure
npx wrikka init
```

### Manual Setup

1. Create a new directory for your project
2. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```
3. Install the Wrikka CLI:
   ```bash
   npm install --save-dev @wrikka/cli
   ```
4. Create an `index.js` file with the following content:
   ```javascript
   #!/usr/bin/env node
   
   import { Command } from '@wrikka/cli';
   
   const program = new Command();
   
   program
     .name('my-cli')
     .description('My awesome CLI application')
     .version('1.0.0');
   
   program
     .command('hello')
     .description('Say hello')
     .action(() => {
       console.log('Hello from Wrikka CLI!');
     });
   
   program.parse(process.argv);
   ```
5. Add the following to your `package.json`:
   ```json
   {
     "bin": {
       "my-cli": "./index.js"
     },
     "type": "module"
   }
   ```
6. Make your script executable:
   ```bash
   chmod +x index.js
   ```
7. Link your package globally for development:
   ```bash
   npm link
   ```

## Running Your CLI

### During Development

```bash
# Run directly with Node
node index.js

# Or use the linked command (after running npm link)
my-cli hello
```

### After Publishing

```bash
# Install your CLI globally
npm install -g my-cli

# Run your command
my-cli hello
```

## Project Structure

A typical Wrikka CLI project has the following structure:

```
my-cli/
├── src/
│   ├── commands/      # Command definitions
│   ├── utils/         # Utility functions
│   ├── config.js      # Configuration
│   └── index.js       # Main entry point
├── tests/             # Test files
├── .wrikkarc          # Wrikka CLI configuration
├── package.json
└── README.md
```

## Configuration

Create a `.wrikkarc` file in your project root to configure the CLI:

```json
{
  "name": "my-cli",
  "version": "1.0.0",
  "description": "My awesome CLI application",
  "commands": "./src/commands",
  "themes": {
    "default": {
      "primary": "#007bff",
      "success": "#28a745",
      "warning": "#ffc107",
      "error": "#dc3545",
      "info": "#17a2b8"
    }
  }
}
```

## Creating Commands

1. Create a new file in the `src/commands` directory, e.g., `greet.js`:
   ```javascript
   import { Command } from '@wrikka/cli';
   
   export default new Command()
     .name('greet')
     .description('Greet a user')
     .argument('<name>', 'Name to greet')
     .option('-e, --excited', 'Add excitement to the greeting')
     .action((name, options) => {
       const greeting = options.excited 
         ? `HELLO ${name.toUpperCase()}! 👋`
         : `Hello, ${name}.`;
       console.log(greeting);
     });
   ```

2. Import and register the command in your main file:
   ```javascript
   import greetCommand from './commands/greet.js';
   
   program.addCommand(greetCommand);
   ```

## Testing Your CLI

Wrikka CLI works well with popular testing frameworks like Jest or Mocha. Here's a simple test example using Jest:

```javascript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('My CLI', () => {
  it('should greet the user', async () => {
    const { stdout } = await execAsync('node index.js greet John');
    expect(stdout).toContain('Hello, John.');
  });
});
```

## Publishing Your CLI

1. Make sure your `package.json` has all the necessary fields:
   ```json
   {
     "name": "my-cli",
     "version": "1.0.0",
     "description": "My awesome CLI application",
     "bin": {
       "my-cli": "./src/index.js"
     },
     "files": ["src"],
     "type": "module"
   }
   ```

2. Build your project (if using a build step)

3. Publish to npm:
   ```bash
   npm login
   npm publish --access public
   ```

## Next Steps

- Learn about [Creating Your First CLI](/framework/cli/get-started/first-steps)
- Explore [CLI Commands](/framework/cli/terminal-interface/commands)
- Discover [Interactive Prompts](/framework/cli/terminal-interface/prompts)
