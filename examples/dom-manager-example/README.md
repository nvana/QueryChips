# QueryChips DOM Manager Example

This example demonstrates the **QueryChipsDOMManager** class, which provides optimized and reactive DOM management capabilities for QueryChips.

## Features Demonstrated

### 🎯 **Element Creation & Updates**
- **Optimized Element Creation**: Create DOM elements with a single method call
- **Batched Updates**: Multiple updates to the same element are batched for performance
- **Reactive Updates**: Changes are applied efficiently using `requestAnimationFrame`

### 🎧 **Event Handling**
- **Event Listener Management**: Add and remove event listeners with automatic cleanup
- **Event Delegation**: Support for event delegation to reduce memory usage
- **Event Options**: Support for `passive`, `once`, and other event options

### 👁️ **DOM Observation**
- **MutationObserver Integration**: Observe DOM changes in real-time
- **Configurable Options**: Customize what types of mutations to observe
- **Automatic Cleanup**: Observers are automatically disconnected when destroyed

### 🎬 **Animations**
- **Web Animations API**: Use the modern Web Animations API
- **Keyframe Support**: Define complex animations with keyframes
- **Animation Control**: Start, pause, and cancel animations

### ⏱️ **Performance Optimization**
- **Debouncing**: Prevent excessive function calls with debouncing
- **Throttling**: Limit function execution rate with throttling
- **Element Caching**: Cache frequently accessed elements for better performance

### 🛠️ **Element Utilities**
- **Element Measurement**: Get precise measurements of elements
- **Viewport Detection**: Check if elements are in the viewport
- **Focus Management**: Handle focus with accessibility considerations
- **Smooth Scrolling**: Scroll elements into view smoothly

## How to Run

1. **Build the project** (if not already built):
   ```bash
   npm run build
   ```

2. **Open the example**:
   ```bash
   # Using a local server (recommended)
   npx http-server . -p 3000
   
   # Or open index.html directly in your browser
   ```

3. **Navigate to the example**:
   ```
   http://localhost:3000/examples/dom-manager-example/
   ```

## Interactive Demo Sections

### 📊 **Statistics Dashboard**
Real-time statistics showing:
- Number of active event listeners
- Number of DOM observers
- Number of running animations
- Number of pending DOM updates
- Number of cached elements

### 🎨 **Element Creation & Updates**
- Create dynamic elements with custom text, classes, and styles
- Update existing elements with new properties
- See batched updates in action

### 🎧 **Event Handling**
- Add multiple event listeners to elements
- Test click, mouseover, and mouseout events
- Remove event listeners and see the statistics update

### 👁️ **DOM Observation**
- Start observing DOM changes
- Modify the observed element and see mutations logged
- Stop observing to clean up resources

### 🎬 **Animations**
- Start smooth animations with custom keyframes
- Cancel running animations
- See animation completion callbacks

### ⏱️ **Debouncing & Throttling**
- Type in the debounced input to see delayed execution
- Type in the throttled input to see rate-limited execution
- Compare the behavior of both techniques

### 🛠️ **Element Utilities**
- Measure element dimensions and properties
- Check if elements are in the viewport
- Test focus and blur functionality

## Code Examples

### Creating Elements
```javascript
const element = domManager.createElement('div', {
  className: 'my-class',
  id: 'my-element',
  textContent: 'Hello World',
  attributes: {
    'data-test': 'value'
  },
  styles: {
    'background-color': 'blue',
    'color': 'white'
  }
});
```

### Updating Elements
```javascript
domManager.updateElement({
  element: myElement,
  updates: {
    textContent: 'Updated text'
  },
  classes: {
    add: ['new-class'],
    remove: ['old-class']
  },
  styles: {
    'background-color': 'red'
  }
});
```

### Event Handling
```javascript
const eventId = domManager.addEventListener(element, {
  type: 'click',
  handler: () => console.log('Clicked!'),
  options: { passive: true }
});

// Later, remove the listener
domManager.removeEventListener(eventId);
```

### DOM Observation
```javascript
const observerId = domManager.observeDOM({
  target: element,
  callback: (mutations) => {
    mutations.forEach(mutation => {
      console.log('DOM changed:', mutation.type);
    });
  }
});
```

### Animations
```javascript
const animationId = domManager.animateElement({
  element: myElement,
  keyframes: [
    { transform: 'scale(1)' },
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' }
  ],
  options: { duration: 1000, easing: 'ease-in-out' },
  onComplete: () => console.log('Animation finished!')
});
```

### Performance Optimization
```javascript
// Debouncing
const debouncedSearch = domManager.debounce('search', (query) => {
  performSearch(query);
}, 300);

// Throttling
const throttledScroll = domManager.throttle('scroll', (event) => {
  handleScroll(event);
}, 100);
```

## Benefits

### 🚀 **Performance**
- **Batched Updates**: Multiple DOM changes are batched for better performance
- **RequestAnimationFrame**: Updates are synchronized with the browser's refresh rate
- **Event Delegation**: Reduces memory usage for large numbers of elements
- **Element Caching**: Avoids repeated DOM queries

### 🧹 **Memory Management**
- **Automatic Cleanup**: All resources are automatically cleaned up when destroyed
- **Event Listener Tracking**: Prevents memory leaks from forgotten event listeners
- **Observer Management**: DOM observers are properly disconnected

### 🎯 **Developer Experience**
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Consistent API**: Unified interface for all DOM operations
- **Error Handling**: Robust error handling and logging
- **Statistics**: Real-time insights into resource usage

### ♿ **Accessibility**
- **Focus Management**: Proper focus handling with accessibility considerations
- **ARIA Support**: Built-in support for ARIA attributes
- **Keyboard Navigation**: Support for keyboard-based interactions

## Integration with QueryChips

The DOM Manager is fully integrated into QueryChips and provides:

- **Optimized Rendering**: All QueryChips DOM updates go through the DOM Manager
- **Event Handling**: All QueryChips events are managed by the DOM Manager
- **Performance Monitoring**: Real-time performance statistics
- **Memory Safety**: Automatic cleanup prevents memory leaks

This ensures that QueryChips components are performant, accessible, and maintainable. 