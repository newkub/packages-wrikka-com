# Frontmatter

Frontmatter is a YAML block at the beginning of your Markdown files that allows you to define metadata for your pages.

## Basic Usage

```yaml
---
title: Page Title
description: A brief description of the page
layout: default
---

# Your Markdown content here
```

## Available Frontmatter Options

- `title`: The title of the page (used in the browser tab and as the main heading)
- `description`: A brief description for SEO and social sharing
- `layout`: The layout template to use (default, post, etc.)
- `date`: The publication date (format: YYYY-MM-DD)
- `tags`: An array of tags for categorization
- `author`: The author of the content
- `draft`: Set to `true` to mark as draft (won't be built in production)

## Example with All Options

```yaml
---
title: "My Awesome Post"
description: "This is a detailed description of my awesome post"
layout: post
date: 2025-05-17
tags:
  - tutorial
  - documentation
author: "John Doe"
draft: false
---

# Welcome to My Awesome Post

Content goes here...
```

## Dynamic Frontmatter

You can use JavaScript expressions in your frontmatter by wrapping them in `${}`:

```yaml
---
title: "${1 + 1} Things You Need to Know"
date: ${new Date().toISOString()}
---
```
