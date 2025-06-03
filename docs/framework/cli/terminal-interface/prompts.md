# Interactive Prompts

Interactive prompts allow you to collect user input in a user-friendly way. The Wrikka CLI provides a powerful prompt system with various input types and validation options.

## Basic Usage

```javascript
import { prompt } from '@wrikka/cli';

async function main() {
  const answers = await prompt([
    {
      type: 'text',
      name: 'name',
      message: 'What is your name?',
      initial: 'Anonymous',
      validate: (value) => value.length > 0 || 'Name is required'
    },
    {
      type: 'select',
      name: 'color',
      message: 'Pick a color',
      choices: [
        { title: 'Red', value: 'red' },
        { title: 'Green', value: 'green' },
        { title: 'Blue', value: 'blue' }
      ]
    }
  ]);

  console.log(`Hello, ${answers.name}! Your favorite color is ${answers.color}.`);
}

main().catch(console.error);
```

## Input Types

### Text Input

```javascript
const answers = await prompt([
  {
    type: 'text',
    name: 'username',
    message: 'Enter your username:',
    placeholder: 'user123',
    validate: (value) => {
      if (value.length < 3) return 'Username must be at least 3 characters';
      if (!/^[a-z0-9_-]+$/i.test(value)) {
        return 'Username can only contain letters, numbers, underscores, and hyphens';
      }
      return true;
    }
  }
]);
```

### Password Input

```javascript
const answers = await prompt([
  {
    type: 'password',
    name: 'password',
    message: 'Enter your password:',
    mask: '•',
    validate: (value) => value.length >= 8 || 'Password must be at least 8 characters'
  }
]);
```

### Number Input

```javascript
const answers = await prompt([
  {
    type: 'number',
    name: 'age',
    message: 'How old are you?',
    min: 0,
    max: 120,
    float: false,
    initial: 25
  }
]);
```

### Confirmation

```javascript
const answers = await prompt([
  {
    type: 'confirm',
    name: 'confirmed',
    message: 'Are you sure you want to continue?',
    initial: true
  }
]);

if (!answers.confirmed) {
  console.log('Operation cancelled');
  process.exit(0);
}
```

### Select (Single Choice)

```javascript
const answers = await prompt([
  {
    type: 'select',
    name: 'framework',
    message: 'Pick a framework',
    choices: [
      { title: 'React', value: 'react' },
      { title: 'Vue', value: 'vue' },
      { title: 'Angular', value: 'angular' },
      { title: 'Svelte', value: 'svelte' },
      { type: 'separator' },
      { title: 'None', value: 'none' }
    ],
    initial: 1
  }
]);
```

### Multi-Select

```javascript
const answers = await prompt([
  {
    type: 'multiselect',
    name: 'features',
    message: 'Select features to enable:',
    instructions: 'Space to select. Return to submit.',
    choices: [
      { title: 'TypeScript', value: 'typescript', selected: true },
      { title: 'ESLint', value: 'eslint' },
      { title: 'Prettier', value: 'prettier' },
      { title: 'Testing', value: 'testing' },
      { title: 'Docker', value: 'docker' }
    ],
    max: 3, // Optional: limit number of selections
    hint: '- Space to select. Maximum 3.'
  }
]);
```

### Toggle

```javascript
const answers = await prompt([
  {
    type: 'toggle',
    name: 'darkMode',
    message: 'Enable dark mode?',
    initial: true,
    active: 'Yes',
    inactive: 'No'
  }
]);
```

### Date Picker

```javascript
const answers = await prompt([
  {
    type: 'date',
    name: 'birthday',
    message: 'When is your birthday?',
    validate: (date) => {
      const today = new Date();
      if (date > today) return 'Birthday cannot be in the future';
      return true;
    }
  }
]);
```

## Advanced Features

### Dynamic Choices

```javascript
const answers = await prompt([
  {
    type: 'select',
    name: 'project',
    message: 'Select a project',
    choices: async () => {
      // Simulate API call
      const projects = await fetchProjects();
      return projects.map(p => ({
        title: p.name,
        value: p.id,
        description: p.description
      }));
    }
  }
]);
```

### Conditional Prompts

```javascript
const answers = await prompt([
  {
    type: 'select',
    name: 'projectType',
    message: 'Project type?',
    choices: [
      { title: 'Web Application', value: 'web' },
      { title: 'CLI Tool', value: 'cli' },
      { title: 'Library', value: 'lib' }
    ]
  },
  {
    type: (prev) => prev === 'web' ? 'select' : null,
    name: 'framework',
    message: 'Choose a framework',
    choices: [
      { title: 'React', value: 'react' },
      { title: 'Vue', value: 'vue' },
      { title: 'Angular', value: 'angular' }
    ]
  },
  {
    type: (prev, values) => values.projectType === 'web' ? 'confirm' : null,
    name: 'useTypeScript',
    message: 'Use TypeScript?',
    initial: true
  }
]);
```

### Custom Prompt Components

```javascript
import { prompt, PromptType } from '@wrikka/cli';

// Define a custom prompt type
const emailPrompt = {
  type: PromptType.Text,
  name: 'email',
  message: 'Enter your email:',
  validate: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Please enter a valid email';
  }
};

// Use the custom prompt
const answers = await prompt([emailPrompt]);
```

## Styling and Theming

```javascript
const answers = await prompt([
  {
    type: 'select',
    name: 'theme',
    message: 'Select a theme',
    choices: [
      { title: 'Light', value: 'light' },
      { title: 'Dark', value: 'dark' },
      { title: 'System', value: 'system' }
    ],
    styles: {
      // Custom styling
      primary: '#007bff',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8',
      // Custom styles for specific elements
      input: { bg: '#f8f9fa', border: '#ced4da' },
      selected: { bg: '#e9ecef' },
      focused: { border: '#80bdff', shadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' }
    }
  }
]);
```

## Best Practices

1. **Provide Clear Instructions**: Always include helpful messages and placeholders.
2. **Validate Input**: Use validation to ensure data quality.
3. **Provide Defaults**: Set sensible defaults when possible.
4. **Keep It Simple**: Don't overwhelm users with too many prompts.
5. **Group Related Prompts**: Use sections or conditional logic to organize related prompts.
6. **Handle Interruptions**: Allow users to cancel or go back.
7. **Show Progress**: For long-running operations, show progress indicators.

## Error Handling

```javascript
try {
  const answers = await prompt([
    {
      type: 'number',
      name: 'age',
      message: 'How old are you?',
      validate: (value) => {
        if (isNaN(value)) return 'Please enter a valid number';
        if (value < 0) return 'Age cannot be negative';
        return true;
      }
    }
  ]);
  console.log(`You are ${answers.age} years old`);
} catch (error) {
  if (error.isTtyError) {
    console.error('Prompt could not be rendered in the current environment');
  } else if (error.isCancelled) {
    console.log('Prompt was cancelled');
  } else {
    console.error('An error occurred:', error);
  }
}
```

## Next Steps

- [Logger](/framework/cli/terminal-interface/logger)
- [Tables](/framework/cli/terminal-interface/table)
- [Loading Indicators](/framework/cli/terminal-interface/loading)
