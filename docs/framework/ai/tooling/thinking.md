# Thinking

The Thinking API provides structured reasoning capabilities to help AI models solve complex problems through step-by-step reasoning, reflection, and self-correction.

## Overview

Thinking capabilities include:
- **Chain of Thought**: Break down complex problems into steps
- **Self-Reflection**: Evaluate and improve upon initial answers
- **Critique**: Analyze responses for potential issues
- **Planning**: Create and execute multi-step plans

## Quick Start

```typescript
import { createAIClient } from '@wrikka/ai-sdk';

const ai = createAIClient({
  apiKey: 'your-api-key',
});

// Simple chain of thought
const result = await ai.think({
  prompt: 'If a train travels 300 miles in 2 hours, what is its speed in miles per hour?',
  reasoning: 'stepByStep',
});

console.log(result.answer); // 150
console.log(result.thinking);
// Step 1: To find speed, we use the formula: speed = distance / time
// Step 2: Distance = 300 miles, Time = 2 hours
// Step 3: Speed = 300 miles / 2 hours = 150 miles per hour
```

## Core Concepts

### 1. Chain of Thought

Break down complex problems into manageable steps:

```typescript
const response = await ai.think({
  prompt: 'A store has 10 apples. If 3 apples are sold and then 5 more are delivered, how many apples are there?',
  reasoning: 'stepByStep',
  format: 'markdown',
});

console.log(response.thinking);
/*
1. Initial number of apples: 10
2. Apples sold: -3
3. Apples after sale: 10 - 3 = 7
4. Apples delivered: +5
5. Final count: 7 + 5 = 12
*/
```

### 2. Self-Reflection

Evaluate and improve upon initial answers:

```typescript
const response = await ai.think({
  prompt: 'What is the capital of France?',
  reasoning: 'reflect',
  reflectionSteps: 2, // Number of reflection iterations
});

console.log('Final answer:', response.answer);
console.log('Reflection process:', response.reflection);
```

### 3. Critique

Analyze a response for potential issues:

```typescript
const critique = await ai.critique({
  prompt: 'Explain quantum computing',
  response: 'Quantum computing uses quantum bits which can be 0 or 1 at the same time.',
  criteria: ['accuracy', 'completeness', 'clarity'],
});

console.log('Score (0-1):', critique.score);
console.log('Feedback:', critique.feedback);
```

## Advanced Usage

### Multi-Step Planning

Create and execute complex plans:

```typescript
const plan = await ai.plan({
  goal: 'Plan a birthday party for 20 people',
  steps: 5, // Number of steps to generate
  constraints: [
    'Budget: $500',
    'Must be indoors',
    'At least 3 hours long',
  ],
});

console.log('Plan:', plan.steps);
// Execute each step
for (const step of plan.steps) {
  console.log(`Executing: ${step.action}`);
  // Execute the step...
}
```

### Hypothesis Generation

Generate and test hypotheses:

```typescript
const hypothesis = await ai.generateHypothesis({
  observation: 'The website has high bounce rate on mobile devices',
  context: 'The website is an e-commerce platform',
  numHypotheses: 3,
});

console.log('Possible explanations:', hypothesis.explanations);

// Test the first hypothesis
const testResult = await ai.designExperiment({
  hypothesis: hypothesis.explanations[0],
  metrics: ['bounce_rate', 'time_on_page'],
});

console.log('Experiment design:', testResult.design);
```

## API Reference

### `think(options: ThinkOptions): Promise<ThinkResponse>`

Performs structured thinking to solve a problem.

**Parameters:**
- `prompt` (string): The problem to solve.
- `reasoning` ('stepByStep' | 'reflect' | 'auto'): Type of reasoning to apply.
- `format` ('text' | 'markdown' | 'json'): Output format.
- `temperature` (number, 0-1): Controls randomness.
- `maxTokens` (number): Maximum number of tokens to generate.

**Returns:**
- `answer` (string): The final answer.
- `thinking` (string): The reasoning process.
- `confidence` (number, 0-1): Confidence score.
- `sources` (string[]): Sources used (if any).

### `critique(options: CritiqueOptions): Promise<CritiqueResponse>`

Evaluates a response against a prompt.

**Parameters:**
- `prompt` (string): The original prompt.
- `response` (string): The response to critique.
- `criteria` (string[]): Criteria for evaluation.
- `scale` (number, 1-10): Rating scale.

**Returns:**
- `score` (number): Numeric score.
- `feedback` (string): Detailed feedback.
- `suggestions` (string[]): Improvement suggestions.

### `plan(options: PlanOptions): Promise<PlanResponse>`

Creates a plan to achieve a goal.

**Parameters:**
- `goal` (string): The goal to achieve.
- `steps` (number): Number of steps to generate.
- `constraints` (string[]): Constraints to consider.
- `resources` (string[]): Available resources.

**Returns:**
- `steps` (Array<{action: string, expectedOutcome: string}>): The plan steps.
- `risks` (string[]): Potential risks.
- `alternatives` (string[]): Alternative approaches.

## Best Practices

1. **Start Simple**: Begin with basic chain of thought before complex reasoning.
2. **Iterate**: Use reflection to improve initial answers.
3. **Be Specific**: Provide clear criteria for evaluations.
4. **Monitor**: Track the quality of reasoning over time.
5. **Combine Tools**: Use with other APIs for best results.

## Error Handling

```typescript
try {
  const result = await ai.think({
    prompt: 'Solve this complex problem...',
    reasoning: 'stepByStep',
  });
  console.log(result.answer);
} catch (error) {
  if (error.code === 'REASONING_TIMEOUT') {
    console.error('Thinking process took too long');
  } else if (error.code === 'INVALID_REASONING_METHOD') {
    console.error('Invalid reasoning method specified');
  } else {
    console.error('Thinking error:', error.message);
  }
}
```

## Rate Limits

- Free tier: 100 thinking operations/minute
- Pro tier: 1,000 thinking operations/minute
- Enterprise: Custom limits available

## Next Steps

- [Search](/framework/ai/tooling/search)
- [Research](/framework/ai/tooling/research)
- [Computer Vision](/framework/ai/tooling/computer-vision)
