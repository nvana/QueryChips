# QueryChips Vue Example

This example demonstrates how to use QueryChips in a Vue 3 application with the provided wrapper component.

## Features Demonstrated

- **Manual Field Configuration**: Employee directory with predefined field types
- **Product Catalog**: Another example with different field types
- **Field Inference Mode**: Automatic field detection with enum threshold

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3001`

## Examples Included

### Employee Directory
- Manual field configuration
- String, enum, number, and boolean field types
- Real-time filtering with results table

### Product Catalog
- Different field types and operators
- Price ranges and stock status filtering

### Field Inference Mode
- Automatic field type detection
- Enum threshold configuration (≤5 unique values)
- No manual field configuration required

## Key Features

- **TypeScript Support**: Full type safety with QueryChips types
- **Reactive Updates**: Results update automatically as you filter
- **Clean Integration**: Simple wrapper component handles all QueryChips lifecycle
- **Multiple Examples**: Different use cases and configurations

## Usage

```vue
<template>
  <QueryChipsVue
    :data="data"
    :inferFields="true"
    :enumThreshold="5"
    @change="filtered = $event[0]"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QueryChipsVue from 'querychips/vue';

const data = [/* your data */];
const filtered = ref(data);
</script>
```

## Dependencies

- Vue 3+
- TypeScript
- Vite (for development)
- QueryChips (local package) 