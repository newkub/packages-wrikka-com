# Instructions and Help System

The Instructions component in Wrikka CLI provides a consistent way to display help text, documentation, and usage instructions within your command-line applications.

## Basic Usage

### Simple Instructions

```javascript
import { instructions } from '@wrikka/cli';

// Display basic instructions
instructions({
  title: 'Getting Started',
  description: 'Welcome to My CLI Tool! Follow these steps to get started.'
});
```

### With Steps

```javascript
instructions({
  title: 'Installation Guide',
  steps: [
    'Install the package: `npm install -g my-cli`',
    'Run the setup: `my-cli setup`',
    'Start using the tool: `my-cli start`'
  ]
});
```

## Advanced Usage

### With Code Blocks

```javascript
instructions({
  title: 'API Authentication',
  description: 'To authenticate with the API, you need to set up your API key:',
  code: `// In your application code
import { Client } from 'my-api-client';

const client = new Client({
  apiKey: process.env.API_KEY,
  environment: 'production'
});`,
  notes: [
    'Never commit your API key to version control!',
    'Use environment variables for sensitive data.'
  ]
});
```

### Interactive Help

```javascript
import { instructions, select } from '@wrikka/cli';

async function showHelp() {
  const topic = await select({
    message: 'Select a help topic',
    choices: [
      { title: 'Getting Started', value: 'start' },
      { title: 'Commands', value: 'commands' },
      { title: 'Configuration', value: 'config' },
      { title: 'Troubleshooting', value: 'trouble' },
      { title: 'Exit', value: 'exit' }
    ]
  });

  if (topic === 'exit') return;

  const helpContent = {
    start: {
      title: 'Getting Started',
      steps: [
        'Install the CLI: `npm install -g my-cli`',
        'Run `my-cli init` to create a new project',
        'Start developing with `my-cli dev`'
      ]
    },
    commands: {
      title: 'Available Commands',
      description: 'Here are the main commands you can use:',
      commands: [
        { name: 'init', description: 'Initialize a new project' },
        { name: 'dev', description: 'Start development server' },
        { name: 'build', description: 'Build for production' },
        { name: 'deploy', description: 'Deploy your application' },
        { name: 'help', description: 'Show this help message' }
      ]
    },
    config: {
      title: 'Configuration',
      description: 'You can configure the CLI using a `.myclirc` file:',
      code: `{
  "apiEndpoint": "https://api.example.com",
  "theme": "dark",
  "features": {
    "analytics": true,
    "notifications": true
  }
}`,
      notes: [
        'The configuration file should be placed in your home directory or project root.',
        'Run `my-cli config --help` for more options.'
      ]
    },
    trouble: {
      title: 'Troubleshooting',
      description: 'Common issues and solutions:',
      faq: [
        {
          question: 'Installation fails with permissions error',
          answer: 'Try running with sudo: `sudo npm install -g my-cli` or fix npm permissions.'
        },
        {
          question: 'Command not found',
          answer: 'Ensure the installation directory is in your PATH environment variable.'
        },
        {
          question: 'API connection issues',
          answer: 'Check your internet connection and verify the API endpoint in your configuration.'
        }
      ]
    }
  }[topic];

  instructions(helpContent);
  
  // Show help again
  await showHelp();
}

// Start the interactive help
showHelp().catch(console.error);
```

## Real-world Examples

### CLI Tool Help

```javascript
import { instructions } from '@wrikka/cli';

function showHelp() {
  instructions({
    title: 'My Awesome CLI Tool',
    description: 'A command-line tool to simplify your workflow.',
    version: '1.0.0',
    usage: [
      'my-cli <command> [options]',
      '',
      'Examples:',
      '  my-cli init         Initialize a new project',
      '  my-cli build       Build the project',
      '  my-cli deploy      Deploy to production'
    ],
    commands: [
      { name: 'init', description: 'Create a new project' },
      { name: 'build', description: 'Build the project for production' },
      { name: 'deploy', description: 'Deploy to the specified environment' },
      { name: 'config', description: 'Manage configuration' },
      { name: 'help', description: 'Display help information' }
    ],
    options: [
      { name: '--version', description: 'Show version' },
      { name: '--help', description: 'Show help' },
      { name: '--debug', description: 'Enable debug mode' }
    ],
    examples: [
      '# Create a new project',
      'my-cli init my-project',
      '',
      '# Build with production settings',
      'NODE_ENV=production my-cli build',
      '',
      '# Deploy to staging',
      'my-cli deploy --env staging'
    ],
    footer: [
      'For more information, visit https://github.com/username/my-cli',
      'Report bugs to: bugs@example.com'
    ]
  });
}

// Show help if no arguments provided
if (process.argv.length <= 2) {
  showHelp();
  process.exit(0);
}
```

### API Documentation

```javascript
import { instructions } from '@wrikka/cli';

function showAPIDocs() {
  instructions({
    title: 'REST API Documentation',
    description: 'Interact with our API using standard HTTP methods.',
    sections: [
      {
        title: 'Authentication',
        content: 'All API requests require an API key in the `Authorization` header.',
        code: 'Authorization: Bearer YOUR_API_KEY',
        notes: [
          'You can get an API key from the dashboard.',
          'Keep your API key secure and never expose it in client-side code.'
        ]
      },
      {
        title: 'Endpoints',
        endpoints: [
          {
            method: 'GET',
            path: '/api/v1/users',
            description: 'List all users',
            parameters: [
              { name: 'limit', type: 'number', default: '10', description: 'Number of results per page' },
              { name: 'page', type: 'number', default: '1', description: 'Page number' }
            ]
          },
          {
            method: 'POST',
            path: '/api/v1/users',
            description: 'Create a new user',
            body: {
              name: 'string (required)',
              email: 'string (required, unique)',
              role: 'string (default: "user")'
            },
            example: {
              request: 'POST /api/v1/users\nContent-Type: application/json\n\n{"name":"John Doe","email":"john@example.com"}',
              response: '201 Created\n{"id":"123","name":"John Doe","email":"john@example.com","role":"user"}'
            }
          }
        ]
      },
      {
        title: 'Error Handling',
        content: 'The API uses standard HTTP status codes to indicate success or failure.',
        statusCodes: [
          { code: 200, description: 'OK - Request successful' },
          { code: 201, description: 'Created - Resource created successfully' },
          { code: 400, description: 'Bad Request - Invalid request format' },
          { code: 401, description: 'Unauthorized - Invalid or missing API key' },
          { code: 404, description: 'Not Found - Resource not found' },
          { code: 500, description: 'Internal Server Error - Something went wrong on our end' }
        ],
        errorExample: {
          request: 'GET /api/v1/users/nonexistent',
          response: '404 Not Found\n{"error":"User not found","code":"not_found"}'
        }
      }
    ]
  });
}
```

## API Reference

### `instructions(options: InstructionOptions): void`

#### InstructionOptions

- `title` (string): Main title
- `description` (string): Description text
- `version` (string): Version number
- `usage` (string[]): Usage examples
- `commands` (Array<{name: string, description: string, alias?: string}>): List of commands
- `options` (Array<{name: string, description: string, alias?: string}>): List of options
- `examples` (string[]): Example commands
- `sections` (Array<{title: string, content: string}>): Content sections
- `steps` (string[]): Step-by-step instructions
- `code` (string): Code block to display
- `notes` (string[]): Additional notes
- `footer` (string[]): Footer text

## Best Practices

1. **Be Concise**: Keep instructions clear and to the point
2. **Use Examples**: Show practical examples of commands
3. **Structure Content**: Use sections and headers to organize information
4. **Highlight Important Info**: Use formatting to draw attention to key points
5. **Provide Context**: Explain why certain steps are necessary
6. **Include Error Handling**: Document common errors and solutions

## Next Steps

- [Examples](/framework/cli/examples)
- [API Reference](/framework/cli/api-reference)
- [Contributing](/framework/cli/contributing)
