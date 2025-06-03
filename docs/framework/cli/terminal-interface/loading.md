# Loading Indicators

Loading indicators in the Wrikka CLI help provide feedback during asynchronous operations. They enhance user experience by showing that the application is working on a task.

## Basic Spinner

```javascript
import { loading } from '@wrikka/cli';

// Start a loading spinner
const stopLoading = loading('Processing...');

try {
  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Stop with success
  stopLoading(true, 'Processing completed!');
} catch (error) {
  // Stop with error
  stopLoading(false, 'Processing failed: ' + error.message);
}
```

## Progress Bar

```javascript
import { progress } from '@wrikka/cli';

// Create a progress bar
const bar = progress({
  total: 100,
  width: 40,
  format: 'Downloading: {bar} {percentage}% | {value}/{total} | ETA: {eta}s'
});

// Simulate progress
for (let i = 0; i <= 100; i += 10) {
  await new Promise(resolve => setTimeout(resolve, 300));
  bar.update(i);
}

// Complete the progress bar
bar.stop();
```

## Advanced Usage

### Custom Spinner Styles

```javascript
import { loading, spinners } from '@wrikka/cli';

// Use a different spinner style
const stopLoading = loading({
  text: 'Processing with dots',
  spinner: spinners.dots
});

// Or use a custom frame sequence
const customSpinner = loading({
  text: 'Custom spinner',
  spinner: {
    interval: 80,
    frames: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
  }
});

// Don't forget to stop the spinners
setTimeout(() => {
  stopLoading(true, 'Done!');
  customSpinner(true, 'Custom spinner done!');
}, 2000);
```

### Nested Loading Indicators

```javascript
import { loading } from '@wrikka/cli';

async function processTasks() {
  const outer = loading('Starting process...');
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const inner = loading('  ↳ Processing subtask...', { indent: 2 });
    await new Promise(resolve => setTimeout(resolve, 1500));
    inner(true, '  ↳ Subtask completed');
    
    outer.updateText('Finalizing...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    outer(true, 'All tasks completed successfully!');
  } catch (error) {
    outer(false, 'Process failed: ' + error.message);
  }
}

processTasks();
```

## Real-world Examples

### File Download with Progress

```javascript
import { progress } from '@wrikka/cli';
import fs from 'fs';
import https from 'https';
import path from 'path';

async function downloadFile(url, destination) {
  const file = fs.createWriteStream(destination);
  
  const bar = progress({
    total: 0,
    width: 40,
    format: 'Downloading: {bar} {percentage}% | {downloaded}/{size} MB | Speed: {speed} MB/s | ETA: {eta}s'
  });
  
  let downloaded = 0;
  let startTime = Date.now();
  let lastUpdate = 0;
  
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      const totalSize = parseInt(response.headers['content-length'], 10);
      bar.setTotal(totalSize);
      
      response.on('data', chunk => {
        downloaded += chunk.length;
        const now = Date.now();
        
        // Update at most every 100ms for better performance
        if (now - lastUpdate > 100 || downloaded === totalSize) {
          const elapsed = (now - startTime) / 1000; // in seconds
          const speed = (downloaded / (1024 * 1024)) / (elapsed || 1); // MB/s
          
          bar.update(downloaded, {
            downloaded: (downloaded / (1024 * 1024)).toFixed(2),
            size: (totalSize / (1024 * 1024)).toFixed(2),
            speed: speed.toFixed(2),
            eta: totalSize > 0 
              ? Math.ceil((totalSize - downloaded) / (speed * 1024 * 1024))
              : 0
          });
          
          lastUpdate = now;
        }
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        bar.stop();
        resolve(destination);
      });
    }).on('error', error => {
      fs.unlink(destination, () => {}); // Delete the file async
      bar.stop();
      reject(error);
    });
  });
}

// Usage
const fileUrl = 'https://example.com/large-file.zip';
const dest = './downloads/large-file.zip';

try {
  console.log(`Downloading ${fileUrl}...`);
  await downloadFile(fileUrl, dest);
  console.log('Download completed successfully!');
} catch (error) {
  console.error('Download failed:', error.message);
}
```

### Multi-step Process

```javascript
import { loading } from '@wrikka/cli';

async function setupProject() {
  const steps = [
    { name: 'Creating project structure', duration: 1000 },
    { name: 'Installing dependencies', duration: 2000 },
    { name: 'Configuring settings', duration: 1500 },
    { name: 'Building project', duration: 3000 },
    { name: 'Running tests', duration: 2500 }
  ];
  
  for (const [index, step] of steps.entries()) {
    const spinner = loading(`[${index + 1}/${steps.length}] ${step.name}`);
    
    try {
      // Simulate work
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 10% chance of failure for demonstration
          if (Math.random() < 0.1) {
            reject(new Error('Random error occurred'));
          } else {
            resolve();
          }
        }, step.duration);
      });
      
      spinner(true, `[${index + 1}/${steps.length}] ${step.name} ✓`);
    } catch (error) {
      spinner(false, `[${index + 1}/${steps.length}] ${step.name} ✗ (${error.message})`);
      throw error; // Re-throw to stop the process
    }
  }
  
  return true;
}

// Run the setup
console.log('Starting project setup...\n');

try {
  await setupProject();
  console.log('\n✅ Project setup completed successfully!');
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
}
```

## API Reference

### `loading(options: string | LoadingOptions): StopLoadingFunction`

Create a loading spinner.

#### Options

- `text` (string): Text to display next to the spinner
- `spinner` (Spinner | string): Spinner style or custom spinner definition
- `color` (string): Spinner color
- `indent` (number): Number of spaces to indent the spinner

#### Returns

A function to stop the loading spinner:
- `stop(success: boolean, message?: string)`: Stop the spinner with optional success/failure message

### `progress(options: ProgressOptions): ProgressBar`

Create a progress bar.

#### Options

- `total` (number): Total number of ticks to complete
- `width` (number): Width of the progress bar (default: 40)
- `format` (string): Format string with placeholders:
  - `{bar}`: The progress bar
  - `{percentage}`: Completion percentage
  - `{value}`: Current value
  - `{total}`: Total value
  - `{eta}`: Estimated time to completion in seconds
  - `{speed}`: Speed in units per second

#### Methods

- `update(value: number, tokens?: Record<string, any>)`: Update progress
- `stop()`: Stop the progress bar
- `setTotal(total: number)`: Update the total value

## Best Practices

1. **Provide Feedback**: Always show a loading indicator for operations taking longer than 300ms
2. **Be Specific**: Use descriptive text that explains what's happening
3. **Show Progress**: For long operations, show progress when possible
4. **Handle Errors**: Always handle errors and provide clear feedback
5. **Performance**: Use appropriate update intervals to avoid excessive redraws

## Next Steps

- [Tasks](/framework/cli/terminal-interface/tasks)
- [Search](/framework/cli/terminal-interface/search)
- [Instructions](/framework/cli/terminal-interface/instructions)
