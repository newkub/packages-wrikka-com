# Commands

Commands are the building blocks of CLI applications. The Wrikka CLI provides a powerful yet simple way to define and organize commands with support for subcommands, options, arguments, and more.

## Basic Command

```javascript
import { Command } from '@wrikka/cli';

// Create a new command
const hello = new Command()
  .name('hello')
  .description('A simple hello command')
  .action(() => {
    console.log('Hello, World!');
  });

// Execute the command
hello.parse(process.argv);
```

## Command Structure

### Options

Add options to your commands:

```javascript
const greet = new Command()
  .name('greet')
  .description('Greet a user')
  .option('-u, --user <name>', 'User to greet', 'Guest')
  .option('-c, --capitalize', 'Capitalize the name')
  .action((options) => {
    let name = options.user;
    if (options.capitalize) {
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    console.log(`Hello, ${name}!`);
  });
```

### Arguments

Define required and optional arguments:

```javascript
const add = new Command()
  .name('add')
  .description('Add two numbers')
  .argument('<a>', 'First number', parseFloat)
  .argument('[b]', 'Second number', parseFloat, 0) // Optional with default value
  .action((a, b) => {
    console.log(`${a} + ${b} = ${a + b}`);
  });
```

### Subcommands

Organize commands hierarchically:

```javascript
const program = new Command();

// Main command
program
  .name('my-cli')
  .description('A CLI with subcommands')
  .version('1.0.0');

// Subcommand: config
const config = new Command('config')
  .description('Manage configuration');

// Sub-subcommand: config set
config.command('set <key> <value>')
  .description('Set a config value')
  .action((key, value) => {
    console.log(`Setting ${key} to ${value}`);
    // Save to config
  });

// Sub-subcommand: config get
config.command('get <key>')
  .description('Get a config value')
  .action((key) => {
    console.log(`Value for ${key}: ...`);
    // Get from config
  });

// Add subcommand to main program
program.addCommand(config);

// Parse command line arguments
program.parse(process.argv);
```

## Command Lifecycle

### Hooks

Execute code at different stages of the command lifecycle:

```javascript
const cmd = new Command()
  .name('example')
  .hook('preAction', (command) => {
    console.log('Before action execution');
  })
  .action(() => {
    console.log('Action executed');
  })
  .hook('postAction', (command) => {
    console.log('After action execution');
  });
```

### Error Handling

Handle errors in commands:

```javascript
const cmd = new Command()
  .name('dangerous')
  .action(() => {
    throw new Error('Something went wrong!');
  })
  .on('error', (error, command) => {
    console.error(`Error in ${command.name()}:`, error.message);
    process.exit(1);
  });
```

## Advanced Features

### Input Validation

```javascript
const cmd = new Command()
  .name('validate')
  .argument('<age>', 'User age', (value) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new Error('Age must be a number');
    }
    if (parsed < 18) {
      throw new Error('Must be 18 or older');
    }
    return parsed;
  })
  .action((age) => {
    console.log(`You are ${age} years old`);
  });
```

### Custom Help

```javascript
const cmd = new Command()
  .name('custom-help')
  .description('A command with custom help')
  .helpOption('-h, --help', 'Display help for command')
  .addHelpText('after', '\nExamples:\n  $ custom-help --help')
  .action(() => {
    console.log('Command executed');
  });
```

### Command Aliases

```javascript
const cmd = new Command()
  .name('remove')
  .alias('rm')  // Alias for the command
  .description('Remove a file')
  .argument('<file>', 'File to remove')
  .action((file) => {
    console.log(`Removing ${file}...`);
    // Remove file logic
  });
```

## Best Practices

1. **Keep Commands Focused**: Each command should do one thing well.
2. **Use Descriptive Names**: Choose clear, concise names for commands and options.
3. **Provide Help**: Always include descriptions and examples.
4. **Validate Input**: Validate and sanitize all user input.
5. **Handle Errors**: Provide meaningful error messages.
6. **Test Commands**: Write tests for your commands.
7. **Document Options**: Clearly document all options and arguments.

## Examples

### File Operations

```javascript
import { Command } from '@wrikka/cli';
import fs from 'fs/promises';

const fileCmd = new Command()
  .name('file')
  .description('File operations');

// Create file
fileCmd.command('create <filename>')
  .description('Create a new file')
  .option('-c, --content <content>', 'File content', '')
  .action(async (filename, options) => {
    await fs.writeFile(filename, options.content);
    console.log(`Created ${filename}`);
  });

// Read file
fileCmd.command('read <filename>')
  .description('Read a file')
  .action(async (filename) => {
    const content = await fs.readFile(filename, 'utf-8');
    console.log(content);
  });

export default fileCmd;
```

### API Client

```javascript
import { Command } from '@wrikka/cli';
import fetch from 'node-fetch';

const apiCmd = new Command()
  .name('api')
  .description('API client')
  .option('-t, --token <token>', 'API token')
  .hook('preAction', (command) => {
    if (!command.opts().token) {
      console.error('Error: API token is required');
      process.exit(1);
    }
  });

// Get user
apiCmd.command('get-user <id>')
  .description('Get user by ID')
  .action(async (id, options, command) => {
    const token = command.parent.opts().token;
    const response = await fetch(`https://api.example.com/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const user = await response.json();
    console.log(user);
  });

export default apiCmd;
```

## Next Steps

- [Interactive Prompts](/framework/cli/terminal-interface/prompts)
- [Logger](/framework/cli/terminal-interface/logger)
- [Tables](/framework/cli/terminal-interface/table)
