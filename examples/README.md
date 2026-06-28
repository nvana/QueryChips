# QueryChips Examples

This directory contains comprehensive examples demonstrating how to use QueryChips in different frameworks and scenarios.

## Examples Overview

### React Example (`react-example/`)
- **Employee Directory**: Manual field configuration with department, status, and boolean filtering
- **Product Catalog**: E-commerce filtering with price ranges and stock status
- **Analytics Dashboard**: Web analytics with performance metrics
- **Field Inference**: Automatic field detection from data
- **Default Query**: Pre-populated filters using simple and advanced formats

### Vue Example (`vue-example/`)
- **Employee Directory**: Vue 3 composition API with reactive filtering
- **Product Catalog**: E-commerce data with comprehensive filtering
- **Analytics Dashboard**: Performance metrics and conversion tracking
- **Field Inference**: Smart field detection demonstration
- **Default Query**: Default filter examples in Vue

### Vanilla JavaScript Example (`vanilla-example/`)
- **Employee Management**: Basic filtering with field inference
- **Smart Field Inference**: Automatic field detection
- **Default Query**: Simple and advanced default query formats

### Elasticsearch Example (`elasticsearch-example/`)
- **Elasticsearch Integration**: Complete setup with Docker and real Elasticsearch queries

## Default Query Examples

The new default query functionality allows you to pre-populate QueryChips with filters. This is useful for:
- Setting up default views for users
- Implementing saved searches
- Providing filtered data on page load

**Important**: Set `autoApply: true` in your configuration to ensure default filters are applied immediately when the component initializes.

### Available Operators

QueryChips supports different operators based on field type:

**String fields**: `=`, `!=`, `contains`, `startsWith`, `endsWith`, `wildcard`, `prefix`, `regexp`, `fuzzy`, `like`, `not_like`, `regex`, `not_regex`

**Number fields**: `=`, `!=`, `>`, `<`, `>=`, `<=`, `between`, `not_between`

**Boolean fields**: `=`, `!=`

**Enum fields**: `=`, `!=`

**Date fields**: `=`, `!=`, `>`, `<`, `>=`, `<=`, `between`, `not_between`

### Simple Format

```javascript
// Simple object format for basic filters
defaultQuery: [
  { id: '1', field: 'department', operator: '=', value: 'Engineering' },
  { id: '2', field: 'remote', operator: '=', value: true }
]
```

### Advanced Format

```javascript
// Advanced format for complex conditions with groups
defaultQuery: {
  conditions: [
    {
      id: 'group1',
      type: 'group',
      operator: 'OR',
      conditions: [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'department', operator: '=', value: 'Design' }
      ]
    },
    { id: '3', field: 'salary', operator: '>', value: 80000 },
    { id: '4', field: 'status', operator: '=', value: 'Active' }
  ],
  logicalOperators: ['AND', 'AND']
}
```

## Key Features Demonstrated

- 🎯 **Smart field detection** and type inference
- 🔍 **Multiple query language generation** (ES, SQL, MongoDB, GraphQL)
- ⌨️ **Full keyboard navigation** and accessibility
- 🏷️ **Visual filter tags** with remove functionality
- 📱 **Responsive design** with touch support
- 🎨 **Customizable themes** and styling
- 🌍 **Internationalization support**
- ⚡ **High performance** with large datasets
- 🔧 **Framework agnostic** (React, Vue, Angular, Vanilla)
- 📊 **Real-time filtering** and data updates
- 🚀 **Default query support** for pre-populated filters
- 🔢 **Boolean field dropdowns** with true/false options

## Getting Started

1. **React**: `cd react-example && npm install && npm run dev`
2. **Vue**: `cd vue-example && npm install && npm run dev`
3. **Vanilla**: Open `vanilla-example/index.html` in your browser
4. **Elasticsearch**: `cd elasticsearch-example && docker-compose up`

## Usage Patterns

### Basic Setup
```javascript
import { QueryChips } from 'querychips';

const queryChips = new QueryChips({
  data: yourData,
  fields: yourFields,
  onChange: (filteredData, state) => {
    // Handle filtered results
  }
});
```

### With Default Query
```javascript
const queryChips = new QueryChips({
  data: yourData,
  fields: yourFields,
  defaultQuery: [
    { id: '1', field: 'status', operator: '=', value: 'Active' }
  ],
  autoApply: true, // Important: Set to true to apply default filters immediately
  onChange: (filteredData, state) => {
    // Results will be pre-filtered
  }
});
```

### Framework Wrappers
```jsx
// React
<QueryChipsReact
  data={data}
  fields={fields}
  defaultQuery={defaultQuery}
  autoApply={true}
  onChange={handleChange}
/>

// Vue
<QueryChipsVue
  :data="data"
  :fields="fields"
  :defaultQuery="defaultQuery"
  :autoApply="true"
  @change="handleChange"
/>
```

## Contributing

Feel free to add new examples or improve existing ones. Each example should demonstrate specific features or use cases of QueryChips. 