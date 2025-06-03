# Logger

The Wrikka CLI provides a powerful logging system with different log levels, formatting options, and output handling. This documentation covers how to use the logger effectively in your CLI applications.

## Basic Usage

```javascript
import { logger } from '@wrikka/cli';

// Basic logging
logger.log('This is a log message');
logger.info('Informational message');
logger.success('Operation completed successfully!');
logger.warn('This is a warning');
logger.error('An error occurred');
logger.debug('Debug information');
```

## Log Levels

The logger supports different log levels that can be controlled globally:

| Level   | Method       | Description                          |
| ------- | ------------ | ------------------------------------ |
| silent  | N/A          | No logging                           |
| error   | `.error()`   | Critical errors that stop execution |
| warn    | `.warn()`    | Warnings that don't stop execution  |
| info    | `.info()`    | General information                 |
| debug   | `.debug()`   | Debug information                   |
| verbose | `.verbose()` | Very detailed logging               |


### Setting Log Level

```javascript
import { logger } from '@wrikka/cli';

// Set log level (only show errors and above)
logger.level = 'error';

// Available levels: 'silent', 'error', 'warn', 'info', 'debug', 'verbose'
// Default: 'info'
```

## Formatting

### Basic Formatting

```javascript
logger.info('User %s logged in at %s', 'john', new Date().toISOString());
// Output: User john logged in at 2023-05-17T04:30:00.000Z
```

### Styled Output

```javascript
import { logger, style } from '@wrikka/cli';

// Using style helpers
logger.log(style.bold('Important message'));
logger.log(style.green('Success!'));
logger.log(style.bgRed.white('Danger zone!'));

// Chaining styles
logger.log(style.bold.underline.blue('Click here to continue'));
```

### Custom Formatting

```javascript
import { createLogger } from '@wrikka/cli';

const customLogger = createLogger({
  format: (level, message) => {
    const timestamp = new Date().toISOString();
    const levelStr = level.toUpperCase().padEnd(7);
    return `[${timestamp}] ${levelStr} ${message}`;
  },
  level: 'debug'
});

customLogger.info('This is a custom formatted message');
// Output: [2023-05-17T04:30:00.000Z] INFO    This is a custom formatted message
```

## Spinners and Progress

### Spinner

```javascript
import { logger } from '@wrikka/cli';

// Create and start a spinner
const spinner = logger.spinner('Processing...').start();

try {
  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 2000));
  spinner.succeed('Processing completed');
} catch (error) {
  spinner.fail('Processing failed');
  logger.error(error);
}
```

### Progress Bar

```javascript
import { logger } from '@wrikka/cli';

const total = 100;
const progress = logger.progress({
  total,
  format: 'Progress: {bar} {percentage}% | ETA: {eta}s | {value}/{total}'
});

// Simulate progress
for (let i = 0; i <= total; i++) {
  await new Promise(resolve => setTimeout(resolve, 50));
  progress.update(i);
}

progress.stop();
```

## File Logging

```javascript
import { createLogger } from '@wrikka/cli';
import fs from 'fs';

// Create a file transport
const fileLogger = createLogger({
  transports: [
    {
      type: 'file',
      filename: 'app.log',
      format: (level, message) => {
        return `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`;
      },
      level: 'debug'
    }
  ]
});

// Log to file
fileLogger.info('Application started');
fileLogger.debug('Debug information');
```

## Advanced Features

### Custom Transports

```javascript
import { createLogger } from '@wrikka/cli';

const customLogger = createLogger({
  transports: [
    // Console transport (default)
    {
      type: 'console',
      format: (level, message) => `[${level.toUpperCase()}] ${message}`,
      level: 'info'
    },
    // Custom transport
    {
      log: (level, message) => {
        // Send logs to external service
        fetch('https://logs.example.com/api/logs', {
          method: 'POST',
          body: JSON.stringify({ level, message, timestamp: new Date() }),
          headers: { 'Content-Type': 'application/json' }
        }).catch(console.error);
      },
      level: 'error' // Only send error logs
    }
  ]
});
```

### Child Loggers

```javascript
import { createLogger } from '@wrikka/cli';

const mainLogger = createLogger({ prefix: '[Main]' });
const apiLogger = mainLogger.child({ prefix: '[API]' });
const dbLogger = mainLogger.child({ prefix: '[DB]' });

mainLogger.info('Application started');
// Output: [Main] info: Application started

apiLogger.info('Fetching data from API');
// Output: [Main] [API] info: Fetching data from API

dbLogger.debug('Database query executed');
// Output: [Main] [DB] debug: Database query executed
```

## Best Practices

1. **Use Appropriate Log Levels**:
   - `error`: For errors that prevent normal operation
   - `warn`: For potentially harmful situations
   - `info`: For general operational messages
   - `debug`: For debug information
   - `verbose`: For very detailed debug information

2. **Structured Logging**:
   ```javascript
   logger.info('User logged in', { 
     userId: 123, 
     ip: '192.168.1.1',
     timestamp: new Date()
   });
   ```

3. **Error Handling**:
   ```javascript
   try {
     // Some operation
   } catch (error) {
     logger.error('Operation failed', {
       error: error.message,
       stack: error.stack,
       context: { /* additional context */ }
     });
   }
   ```

4. **Performance Considerations**:
   - Use conditional logging for expensive operations:
     ```javascript
     if (logger.level === 'debug') {
       const debugData = expensiveDebugOperation();
       logger.debug('Debug data:', debugData);
     }
     ```

## API Reference

### `logger.log(message: string, ...args: any[])`
Log a message at the default log level.

### `logger.info(message: string, ...args: any[])`
Log an informational message.

### `logger.success(message: string, ...args: any[])`
Log a success message.

### `logger.warn(message: string, ...args: any[])`
Log a warning message.

### `logger.error(message: string | Error, ...args: any[])`
Log an error message or Error object.

### `logger.debug(message: string, ...args: any[])`
Log a debug message (only shown when log level is 'debug' or higher).

### `logger.verbose(message: string, ...args: any[])`
Log a verbose message (only shown when log level is 'verbose').

### `logger.spinner(text: string): Spinner`
Create a new spinner with the given text.

### `logger.progress(options: ProgressOptions): ProgressBar`
Create a new progress bar with the given options.

### `logger.createLogger(options: LoggerOptions): Logger`
Create a new logger instance with custom options.

### `logger.child(options: ChildLoggerOptions): Logger`
Create a child logger that inherits from the current logger.

## Next Steps

- [Tables](/framework/cli/terminal-interface/table)
- [Loading Indicators](/framework/cli/terminal-interface/loading)
- [Tasks](/framework/cli/terminal-interface/tasks)
