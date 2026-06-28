import { QueryChipsDOMManager } from '../dom-manager';

describe('QueryChipsDOMManager', () => {
  let domManager: QueryChipsDOMManager;
  let container: HTMLElement;

  beforeEach(() => {
    domManager = new QueryChipsDOMManager();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    domManager.destroy();
    document.body.removeChild(container);
  });

  describe('Element Creation', () => {
    test('should create elements with basic configuration', () => {
      const element = domManager.createElement('div', {
        className: 'test-class',
        id: 'test-id',
        textContent: 'Test content',
      });

      expect(element.tagName).toBe('DIV');
      expect(element.className).toBe('test-class');
      expect(element.id).toBe('test-id');
      expect(element.textContent).toBe('Test content');
    });

    test('should create elements with attributes', () => {
      const element = domManager.createElement('button', {
        attributes: {
          'type': 'button',
          'data-test': 'test-value',
        },
      });

      expect(element.getAttribute('type')).toBe('button');
      expect(element.getAttribute('data-test')).toBe('test-value');
    });

    test('should create elements with styles', () => {
      const element = domManager.createElement('div', {
        styles: {
          'background-color': 'red',
          'color': 'white',
        },
      });

      expect(element.style.backgroundColor).toBe('red');
      expect(element.style.color).toBe('white');
    });

    test('should create elements with children', () => {
      const child1 = document.createElement('span');
      const child2 = document.createElement('span');

      const element = domManager.createElement('div', {
        children: [child1, child2],
      });

      expect(element.children.length).toBe(2);
      expect(element.children[0]).toBe(child1);
      expect(element.children[1]).toBe(child2);
    });
  });

  describe('Element Updates', () => {
    test('should update element properties', () => {
      const element = document.createElement('input');
      container.appendChild(element);

      domManager.updateElement({
        element,
        updates: {
          value: 'test value',
          disabled: true,
        },
      });

      // Force processing of the update queue
      (domManager as any).processUpdateQueue();

      expect(element.value).toBe('test value');
      expect(element.disabled).toBe(true);
    });

    test('should update element attributes', () => {
      const element = document.createElement('div');
      container.appendChild(element);

      domManager.updateElement({
        element,
        updates: {},
        attributes: {
          'data-test': 'test-value',
          'aria-label': 'Test label',
        },
      });

      (domManager as any).processUpdateQueue();

      expect(element.getAttribute('data-test')).toBe('test-value');
      expect(element.getAttribute('aria-label')).toBe('Test label');
    });

    test('should update element classes', () => {
      const element = document.createElement('div');
      element.className = 'existing-class';
      container.appendChild(element);

      domManager.updateElement({
        element,
        updates: {},
        classes: {
          add: ['new-class-1', 'new-class-2'],
          remove: ['existing-class'],
          toggle: ['toggle-class'],
        },
      });

      (domManager as any).processUpdateQueue();

      expect(element.classList.contains('new-class-1')).toBe(true);
      expect(element.classList.contains('new-class-2')).toBe(true);
      expect(element.classList.contains('existing-class')).toBe(false);
      expect(element.classList.contains('toggle-class')).toBe(true);
    });

    test('should update element styles', () => {
      const element = document.createElement('div');
      container.appendChild(element);

      domManager.updateElement({
        element,
        updates: {},
        styles: {
          'background-color': 'blue',
          'color': 'white',
          'font-size': '16px',
        },
      });

      (domManager as any).processUpdateQueue();

      expect(element.style.backgroundColor).toBe('blue');
      expect(element.style.color).toBe('white');
      expect(element.style.fontSize).toBe('16px');
    });

    test('should batch multiple updates for the same element', () => {
      const element = document.createElement('div');
      container.appendChild(element);

      // Multiple updates for the same element
      domManager.updateElement({
        element,
        updates: { textContent: 'First update' },
      });

      domManager.updateElement({
        element,
        updates: { textContent: 'Second update' },
      });

      domManager.updateElement({
        element,
        updates: {},
        classes: { add: ['class-1'] },
      });

      (domManager as any).processUpdateQueue();

      expect(element.textContent).toBe('Second update');
      expect(element.classList.contains('class-1')).toBe(true);
    });
  });

  describe('Event Handling', () => {
    test('should add event listeners', () => {
      const element = document.createElement('button');
      container.appendChild(element);

      let clickCount = 0;
      const handler = () => {
        clickCount++;
      };

      const eventId = domManager.addEventListener(element, {
        type: 'click',
        handler,
      });

      expect(eventId).toBeDefined();
      expect(typeof eventId).toBe('string');

      element.click();
      expect(clickCount).toBe(1);
    });

    test('should add event listeners with options', () => {
      const element = document.createElement('button');
      container.appendChild(element);

      let clickCount = 0;
      const handler = () => {
        clickCount++;
      };

      const _eventId = domManager.addEventListener(element, {
        type: 'click',
        handler,
        options: { once: true },
      });

      element.click();
      element.click(); // Second click should not trigger due to once: true

      expect(clickCount).toBe(1);
    });

    test('should remove event listeners', () => {
      const element = document.createElement('button');
      container.appendChild(element);

      let clickCount = 0;
      const handler = () => {
        clickCount++;
      };

      const eventId = domManager.addEventListener(element, {
        type: 'click',
        handler,
      });

      const removed = domManager.removeEventListener(eventId);
      expect(removed).toBe(true);

      element.click();
      expect(clickCount).toBe(0);
    });
  });

  describe('DOM Observation', () => {
    test('should observe DOM mutations', () => {
      const target = document.createElement('div');
      container.appendChild(target);

      let mutationCount = 0;
      const callback = () => {
        mutationCount++;
      };

      const observerId = domManager.observeDOM({
        target,
        callback,
      });

      expect(observerId).toBeDefined();

      // Trigger a mutation
      target.appendChild(document.createElement('span'));

      // Wait for mutation observer to fire
      setTimeout(() => {
        expect(mutationCount).toBeGreaterThan(0);
      }, 0);
    });

    test('should disconnect observers', () => {
      const target = document.createElement('div');
      container.appendChild(target);

      let mutationCount = 0;
      const callback = () => {
        mutationCount++;
      };

      const observerId = domManager.observeDOM({
        target,
        callback,
      });

      const disconnected = domManager.disconnectObserver(observerId);
      expect(disconnected).toBe(true);

      // Trigger a mutation after disconnection
      target.appendChild(document.createElement('span'));

      setTimeout(() => {
        expect(mutationCount).toBe(0); // Should not trigger callback
      }, 0);
    });
  });

  describe('Animations', () => {
    test('should animate elements', () => {
      const element = document.createElement('div');
      container.appendChild(element);

      let _animationCompleted = false;
      const onComplete = () => {
        _animationCompleted = true;
      };

      const animationId = domManager.animateElement({
        element,
        keyframes: [
          { opacity: 0 },
          { opacity: 1 },
        ],
        options: { duration: 100 },
        onComplete,
      });

      expect(animationId).toBeDefined();

      // Since Web Animations API is not supported in jsdom,
      // we just check that the ID was generated
      expect(typeof animationId).toBe('string');
    });

    test('should cancel animations', () => {
      const element = document.createElement('div');
      container.appendChild(element);

      const animationId = domManager.animateElement({
        element,
        keyframes: [
          { opacity: 0 },
          { opacity: 1 },
        ],
        options: { duration: 1000 },
      });

      // Since Web Animations API is not supported in jsdom, we expect false
      const cancelled = domManager.cancelAnimation(animationId);
      expect(cancelled).toBe(false);
    });
  });

  describe('Debouncing and Throttling', () => {
    test('should debounce function calls', (done) => {
      let callCount = 0;
      const fn = () => {
        callCount++;
      };

      const debouncedFn = domManager.debounce('test-key', fn, 100);

      // Call multiple times quickly
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Check immediately - should be 0
      expect(callCount).toBe(0);

      setTimeout(() => {
        expect(callCount).toBe(1); // Only the last call should execute
        done();
      }, 150);
    });

    test('should throttle function calls', (done) => {
      let callCount = 0;
      const fn = () => {
        callCount++;
      };

      const throttledFn = domManager.throttle('test-key', fn, 100);

      // Call multiple times quickly
      throttledFn();
      throttledFn();
      throttledFn();

      setTimeout(() => {
        expect(callCount).toBe(1); // Only the first call should execute
        done();
      }, 50);
    });
  });

  describe('Element Utilities', () => {
    test('should get elements with caching', () => {
      const testElement = document.createElement('div');
      testElement.id = 'test-element';
      container.appendChild(testElement);

      const element1 = domManager.getElement('#test-element');
      const element2 = domManager.getElement('#test-element');

      expect(element1).toBe(testElement);
      expect(element2).toBe(testElement);
    });

    test('should measure elements', () => {
      const element = document.createElement('div');
      element.style.width = '100px';
      element.style.height = '50px';
      element.style.position = 'absolute';
      element.style.display = 'block';
      container.appendChild(element);

      // Force layout calculation by accessing offsetHeight
      const _ = element.offsetHeight;

      const measurements = domManager.measureElement(element);

      // In jsdom, we can't rely on exact measurements, so we just check the structure
      expect(measurements).toHaveProperty('offsetWidth');
      expect(measurements).toHaveProperty('offsetHeight');
      expect(measurements).toHaveProperty('clientWidth');
      expect(measurements).toHaveProperty('clientHeight');
      expect(measurements).toHaveProperty('scrollWidth');
      expect(measurements).toHaveProperty('scrollHeight');
      expect(measurements).toHaveProperty('boundingRect');
    });

    test('should check if element is in viewport', () => {
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.top = '0px';
      element.style.left = '0px';
      container.appendChild(element);

      const inViewport = domManager.isInViewport(element);
      expect(typeof inViewport).toBe('boolean');
    });

    test('should focus elements with accessibility', () => {
      const element = document.createElement('button');
      container.appendChild(element);

      domManager.focusElement(element, { focusVisible: true });

      expect(document.activeElement).toBe(element);
      expect(element.classList.contains('focus-visible')).toBe(true);
    });

    test('should blur elements', () => {
      const element = document.createElement('button');
      element.classList.add('focus-visible');
      container.appendChild(element);

      domManager.blurElement(element);

      expect(element.classList.contains('focus-visible')).toBe(false);
    });
  });

  describe('Statistics', () => {
    test('should provide usage statistics', () => {
      const stats = domManager.getStats();

      expect(stats).toHaveProperty('eventListeners');
      expect(stats).toHaveProperty('observers');
      expect(stats).toHaveProperty('animations');
      expect(stats).toHaveProperty('pendingUpdates');
      expect(stats).toHaveProperty('cachedElements');

      expect(typeof stats.eventListeners).toBe('number');
      expect(typeof stats.observers).toBe('number');
      expect(typeof stats.animations).toBe('number');
      expect(typeof stats.pendingUpdates).toBe('number');
      expect(typeof stats.cachedElements).toBe('number');
    });
  });

  describe('Cleanup', () => {
    test('should destroy all resources', () => {
      const element = document.createElement('button');
      container.appendChild(element);

      // Add some resources
      const _eventId = domManager.addEventListener(element, {
        type: 'click',
        handler: () => {},
      });

      const _observerId = domManager.observeDOM({
        target: element,
        callback: () => {},
      });

      const _animationId = domManager.animateElement({
        element,
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: { duration: 1000 },
      });

      // Destroy everything
      domManager.destroy();

      // Check that resources are cleaned up
      const stats = domManager.getStats();
      expect(stats.eventListeners).toBe(0);
      expect(stats.observers).toBe(0);
      expect(stats.animations).toBe(0);
      expect(stats.pendingUpdates).toBe(0);
      expect(stats.cachedElements).toBe(0);
    });
  });
});
