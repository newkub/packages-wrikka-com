# Task Management

The Tasks API in Wrikka CLI provides a powerful way to manage and visualize concurrent and sequential operations with a clean, user-friendly interface.

## Basic Usage

### Sequential Tasks

```javascript
import { tasks } from '@wrikka/cli';

await tasks([
  {
    title: 'Installing dependencies',
    task: async (ctx, task) => {
      // Simulate installation
      await new Promise(resolve => setTimeout(resolve, 1000));
      task.output = 'Dependencies installed successfully';
    }
  },
  {
    title: 'Building project',
    task: async (ctx, task) => {
      // Simulate build process
      for (let i = 0; i <= 100; i += 10) {
        task.output = `Build progress: ${i}%`;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return 'Build completed';
    }
  },
  {
    title: 'Running tests',
    task: async () => {
      // Simulate tests
      await new Promise(resolve => setTimeout(resolve, 1500));
      return 'All tests passed';
    }
  }
]);
```

### Concurrent Tasks

```javascript
import { tasks } from '@wrikka/cli';

await tasks(
  [
    {
      title: 'Fetching user data',
      task: async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return 'User data loaded';
      }
    },
    {
      title: 'Loading configuration',
      task: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return 'Configuration loaded';
      }
    },
    {
      title: 'Initializing database',
      task: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return 'Database ready';
      }
    }
  ],
  { concurrent: true, showSubtasks: true }
);
```

## Advanced Features

### Task Context

```javascript
await tasks([
  {
    title: 'Setup project',
    task: (ctx, task) => {
      ctx.projectName = 'my-project';
      ctx.version = '1.0.0';
      task.title = `Setup project: ${ctx.projectName}@${ctx.version}`;
    }
  },
  {
    title: 'Configure',
    task: (ctx) => {
      return `Configuring ${ctx.projectName} (v${ctx.version})`;
    }
  }
]);
```

### Error Handling

```javascript
try {
  await tasks([
    {
      title: 'Task with error',
      task: async () => {
        throw new Error('Something went wrong');
      }
    }
  ]);
} catch (error) {
  console.error('Task failed:', error.message);
}
```

### Retry Mechanism

```javascript
await tasks([
  {
    title: 'Unreliable operation',
    task: async (ctx, task) => {
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          attempts++;
          task.output = `Attempt ${attempts}/${maxAttempts}`;
          
          // Simulate unreliable operation
          if (Math.random() < 0.7) {
            throw new Error('Temporary failure');
          }
          
          return 'Operation successful';
        } catch (error) {
          if (attempts >= maxAttempts) {
            throw new Error(`Failed after ${maxAttempts} attempts`);
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    },
    retry: 3 // Auto-retry on failure
  }
]);
```

### Custom Renderers

```javascript
import { Listr } from '@wrikka/cli';

const customRenderer = {
  render: () => {
    // Custom rendering logic
  },
  end: () => {
    // Cleanup
  }
};

const taskList = new Listr(
  [
    {
      title: 'Custom task',
      task: () => 'Done'
    }
  ],
  { renderer: customRenderer }
);

await taskList.run();
```

## Real-world Examples

### Project Initialization

```javascript
import { tasks } from '@wrikka/cli';
import fs from 'fs/promises';
import path from 'path';

async function initProject(projectName) {
  const ctx = { projectName };
  
  await tasks([
    {
      title: 'Validating project name',
      task: (ctx) => {
        if (!/^[a-z0-9-]+$/.test(ctx.projectName)) {
          throw new Error('Project name can only contain lowercase letters, numbers, and hyphens');
        }
        return 'Project name is valid';
      }
    },
    {
      title: 'Creating project directory',
      task: async (ctx) => {
        ctx.projectPath = path.resolve(process.cwd(), ctx.projectName);
        
        try {
          await fs.mkdir(ctx.projectPath);
          return 'Directory created';
        } catch (error) {
          if (error.code === 'EEXIST') {
            throw new Error(`Directory "${ctx.projectName}" already exists`);
          }
          throw error;
        }
      }
    },
    {
      title: 'Initializing project',
      task: async (ctx, task) => {
        const pkgJson = {
          name: ctx.projectName,
          version: '1.0.0',
          description: '',
          main: 'index.js',
          scripts: {
            start: 'node index.js',
            test: 'echo \"Error: no test specified\" && exit 1'
          },
          keywords: [],
          author: '',
          license: 'ISC'
        };
        
        task.output = 'Creating package.json';
        await fs.writeFile(
          path.join(ctx.projectPath, 'package.json'),
          JSON.stringify(pkgJson, null, 2)
        );
        
        task.output = 'Creating README.md';
        await fs.writeFile(
          path.join(ctx.projectPath, 'README.md'),
          `# ${ctx.projectName}\n\nProject description`
        );
        
        return 'Project files created';
      }
    },
    {
      title: 'Installing dependencies',
      skip: (ctx) => {
        if (process.env.NODE_ENV === 'test') {
          return 'Skipped in test environment';
        }
        return false;
      },
      task: async (ctx, task) => {
        const { execa } = await import('execa');
        
        task.output = 'Installing dependencies...';
        await execa('npm', ['install', 'express', 'cors'], {
          cwd: ctx.projectPath,
          stdio: 'pipe'
        });
        
        task.output = 'Installing dev dependencies...';
        await execa('npm', ['install', '--save-dev', 'nodemon', 'eslint'], {
          cwd: ctx.projectPath,
          stdio: 'pipe'
        });
        
        return 'Dependencies installed';
      }
    },
    {
      title: 'Initializing Git repository',
      enabled: () => {
        try {
          return !!require('which').sync('git', { nothrow: true });
        } catch {
          return false;
        }
      },
      task: async (ctx, task) => {
        const { execa } = await import('execa');
        
        task.output = 'Initializing Git repository...';
        await execa('git', ['init'], { cwd: ctx.projectPath });
        
        task.output = 'Creating .gitignore...';
        await fs.writeFile(
          path.join(ctx.projectPath, '.gitignore'),
          'node_modules/\n.env\n.DS_Store\n'
        );
        
        await execa('git', ['add', '.'], { cwd: ctx.projectPath });
        await execa('git', ['commit', '-m', 'Initial commit'], { 
          cwd: ctx.projectPath,
          env: { GIT_COMMITTER_NAME: 'Wrikka CLI', GIT_COMMITTER_EMAIL: 'cli@wrikka.com' }
        });
        
        return 'Git repository initialized';
      }
    }
  ], { ctx });
  
  return ctx;
}

// Usage
const projectName = process.argv[2];
if (!projectName) {
  console.error('Please provide a project name');
  process.exit(1);
}

try {
  const { projectPath } = await initProject(projectName);
  console.log(`\n✅ Project created at: ${projectPath}`);
  console.log('\nNext steps:');
  console.log(`  cd ${projectName}`);
  console.log('  npm start\n');
} catch (error) {
  console.error('\n❌ Project creation failed:', error.message);
  process.exit(1);
}
```

### Deployment Workflow

```javascript
import { tasks } from '@wrikka/cli';

async function deploy(environment = 'staging') {
  const ctx = { environment };
  
  await tasks([
    {
      title: 'Validating environment',
      task: (ctx) => {
        if (!['staging', 'production'].includes(ctx.environment)) {
          throw new Error(`Invalid environment: ${ctx.environment}`);
        }
        return `Deploying to ${ctx.environment}`;
      }
    },
    {
      title: 'Running tests',
      task: async () => {
        // Run your test suite
        await new Promise(resolve => setTimeout(resolve, 2000));
        return 'All tests passed';
      }
    },
    {
      title: 'Building application',
      task: async (ctx, task) => {
        // Simulate build process
        for (let i = 0; i <= 100; i += 25) {
          task.output = `Build progress: ${i}%`;
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        ctx.buildId = `build-${Date.now()}`;
        return 'Build completed';
      }
    },
    {
      title: 'Deploying to cloud',
      enabled: (ctx) => ctx.environment === 'production',
      task: async (ctx) => {
        // Simulate deployment
        await new Promise(resolve => setTimeout(resolve, 3000));
        ctx.deploymentUrl = `https://${ctx.environment}.example.com/${ctx.buildId}`;
        return `Deployed to ${ctx.deploymentUrl}`;
      }
    },
    {
      title: 'Running migrations',
      task: async () => {
        // Run database migrations
        await new Promise(resolve => setTimeout(resolve, 1500));
        return 'Migrations completed';
      }
    },
    {
      title: 'Cleaning up',
      task: async () => {
        // Cleanup temporary files
        await new Promise(resolve => setTimeout(resolve, 500));
        return 'Cleanup completed';
      }
    }
  ], { ctx });
  
  return ctx;
}

// Usage
try {
  const environment = process.argv[2] || 'staging';
  const result = await deploy(environment);
  
  console.log('\n✅ Deployment successful!');
  if (result.deploymentUrl) {
    console.log(`🌐 ${result.deploymentUrl}`);
  }
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}
```

## API Reference

### `tasks(tasks: Task[], options?: TaskOptions): Promise<void>`

#### Task

- `title` (string): Task title
- `task` (function): Task function that returns a Promise
- `skip` (boolean | string | function): Skip this task
- `enabled` (boolean | function): Whether the task is enabled
- `retry` (number): Number of retry attempts on failure

#### TaskOptions

- `concurrent` (boolean): Run tasks in parallel (default: false)
- `exitOnError` (boolean): Exit on first error (default: true)
- `showSubtasks` (boolean): Show subtask output (default: true)
- `renderer` (string | object): Renderer to use (default: 'default')
- `ctx` (object): Initial context object

## Best Practices

1. **Clear Task Titles**: Use clear, action-oriented titles
2. **Progress Feedback**: Provide progress updates for long-running tasks
3. **Error Handling**: Handle errors gracefully with meaningful messages
4. **Skip When Possible**: Skip unnecessary tasks when appropriate
5. **Context Sharing**: Use the context object to share data between tasks
6. **Task Granularity**: Break down complex operations into smaller tasks

## Next Steps

- [Search](/framework/cli/terminal-interface/search)
- [Instructions](/framework/cli/terminal-interface/instructions)
- [Examples](/framework/cli/examples)
