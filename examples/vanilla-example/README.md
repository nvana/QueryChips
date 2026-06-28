# QueryChips Vanilla JavaScript Example

This example demonstrates how to use QueryChips in a vanilla JavaScript application without any framework dependencies. **No server required!** Simply open the HTML file in your browser to get started.

## 🚀 Quick Start

1. **Double-click** `index.html` to open it in your browser
2. **That's it!** The example will load and work immediately

## Features Demonstrated

- **Employee Management System**: Filter employees by department, status, experience, location, and more
- **Smart Field Inference**: Automatic field detection and filtering without manual configuration

## Key Features

### Field Inference
QueryChips automatically detects field types from your data and creates appropriate filters:
- String fields get text-based operators (contains, startsWith, etc.)
- Number fields get comparison operators (>, <, >=, <=, etc.)
- Boolean fields get true/false options
- Enum fields get dropdown selections
- Date fields get date-specific operators

### Query Generation
The employee example demonstrates query generation for multiple languages:
- **Elasticsearch**: JSON query objects
- **SQL**: WHERE clause strings
- **MongoDB**: Filter objects
- **GraphQL**: Query strings

### Real-time Filtering
All examples show real-time data filtering as you type and select filter criteria.

### Responsive Design
The example includes a modern, responsive UI with:
- Clean, modern styling
- Hover effects and transitions
- Mobile-friendly layout
- Accessible design patterns

## File Structure

```
examples/vanilla-example/
├── index.html          # Main HTML file with embedded styles
├── app.js             # JavaScript application logic
└── README.md         # This file
```

## Usage Examples

### Basic Setup
```javascript
// The QueryChips library is loaded via script tag
// Access it via window.QueryChips.QueryChips

const queryChips = new window.QueryChips.QueryChips({
  data: yourDataArray,
  container: document.getElementById('filter-container'),
  inferFields: true,
  onChange: (filteredData, state) => {
    // Handle filtered data
    renderTable(filteredData);
  }
});

queryChips.mount(document.getElementById('filter-container'));
```

### With Query Generation
```javascript
const queryChips = new window.QueryChips.QueryChips({
  data: yourDataArray,
  container: document.getElementById('filter-container'),
  inferFields: true,
  queryLanguages: ['elasticsearch', 'sql', 'mongodb', 'graphql'],
  onQueryChange: (queries, state) => {
    // Handle generated queries
    displayQueries(queries);
  }
});
```

### Custom Field Configuration
```javascript
const queryChips = new window.QueryChips.QueryChips({
  data: yourDataArray,
  fields: [
    {
      key: 'name',
      label: 'Employee Name',
      type: 'string',
      placeholder: 'Enter employee name'
    },
    {
      key: 'salary',
      label: 'Salary',
      type: 'number',
      format: (value) => `$${value.toLocaleString()}`
    }
  ],
  onChange: (filteredData, state) => {
    renderTable(filteredData);
  }
});
```

## How It Works

1. **Library Loading**: The QueryChips library is loaded from the local `dist/querychips.js` file
2. **Global Access**: The library is available as `window.QueryChips.QueryChips`
3. **No Build Step**: Everything works directly in the browser without compilation
4. **No Dependencies**: Pure vanilla JavaScript with no external dependencies

## Browser Support

This example works in all modern browsers that support:
- ES6 classes and arrow functions
- Template literals
- Array methods (forEach, filter, etc.)
- Modern CSS features

## Troubleshooting

If you see "QueryChips is not a constructor" error:
1. Make sure the `dist/querychips.js` file exists
2. Check that the script tag is loading correctly
3. Try refreshing the page

## Learn More

- [QueryChips Documentation](https://github.com/nvana/querychips)
- [API Reference](https://github.com/nvana/querychips#api-reference)
- [Theming Guide](https://github.com/nvana/querychips/blob/main/THEMING_AND_TRANSLATION.md) 