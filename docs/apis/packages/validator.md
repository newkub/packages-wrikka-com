## Install

::: code-group
```bash [npm]
npm install @kowork/validator
```

```bash [yarn]
yarn add @kowork/validator
```

```bash [pnpm]
pnpm add @kowork/validator
```

```bash [bun]
bun add @kowork/validator
```
:::

## Usage

### Basic Example

```ts
import { v } from '@kowork/validator'

// Define a schema
const userSchema = v.object({
  name: v.string().min(2),
  age: v.number().positive().int(),
  email: v.string().email(),
  isActive: v.boolean().default(true)
})

// Validate data
const result = userSchema.parse({
  name: 'John',
  age: 30,
  email: 'john@example.com'
})

// Type inference
type User = v.infer<typeof userSchema>
```

### Advanced Validation

### Custom Error Messages

### Conditional Validation

### Array Validation

### Nested Objects