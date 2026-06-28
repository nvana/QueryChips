/**
 * DOM Manager for QueryChips
 * Handles DOM interactions in an optimized and reactive way
 */

export interface DOMEventConfig {
  type: string;
  selector?: string;
  handler: EventListener;
  options?: AddEventListenerOptions;
  passive?: boolean;
  once?: boolean;
}

export interface DOMUpdateConfig {
  element: HTMLElement;
  updates: {
    [key: string]: string | number | boolean | null;
  };
  attributes?: {
    [key: string]: string | null;
  };
  classes?: {
    add?: string[];
    remove?: string[];
    toggle?: string[];
  };
  styles?: {
    [key: string]: string | null;
  };
}

export interface DOMObserverConfig {
  target: HTMLElement;
  callback: (mutations: MutationRecord[]) => void;
  options?: MutationObserverInit;
}

export interface DOMAnimationConfig {
  element: HTMLElement;
  keyframes: Keyframe[] | PropertyIndexedKeyframes;
  options?: KeyframeAnimationOptions;
  onComplete?: () => void;
}

/**
 * Optimized DOM Manager for QueryChips
 * Provides reactive DOM updates, event delegation, and performance optimizations
 */
export class QueryChipsDOMManager {
  private eventListeners: Map<string, DOMEventConfig> = new Map();
  private eventTargets: Map<string, EventTarget> = new Map();
  private observers: Map<string, MutationObserver> = new Map();
  private animations: Map<string, Animation> = new Map();
  private updateQueue: Map<HTMLElement, DOMUpdateConfig[]> = new Map();
  private isProcessingQueue = false;
  private rafId: number | null = null;
  private debounceTimers: Map<string, number> = new Map();

  constructor() {
    this.processUpdateQueue = this.processUpdateQueue.bind(this);
  }

  /**
   * Adds event listener with delegation support
   */
  addEventListener(
    target: EventTarget,
    config: DOMEventConfig,
    useDelegation = false,
  ): string {
    const id = this.generateId('event');

    if (useDelegation && config.selector) {
      const delegatedHandler = (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.matches(config.selector!)) {
          config.handler.call(target, event);
        }
      };

      this.eventListeners.set(id, {
        ...config,
        handler: delegatedHandler,
      });
    } else {
      this.eventListeners.set(id, config);
    }

    this.eventTargets.set(id, target);
    target.addEventListener(config.type, config.handler, config.options);
    return id;
  }

  /**
   * Removes event listener
   */
  removeEventListener(id: string): boolean {
    const config = this.eventListeners.get(id);
    const target = this.eventTargets.get(id);
    if (config && target) {
      target.removeEventListener(config.type, config.handler, config.options);
      this.eventListeners.delete(id);
      this.eventTargets.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Updates DOM element with batched changes
   */
  updateElement(config: DOMUpdateConfig): void {
    const element = config.element;
    const existingUpdates = this.updateQueue.get(element) || [];
    existingUpdates.push(config);
    this.updateQueue.set(element, existingUpdates);

    if (!this.isProcessingQueue) {
      this.scheduleUpdate();
    }
  }

  /**
   * Schedules DOM update processing
   */
  private scheduleUpdate(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      this.processUpdateQueue();
    });
  }

  /**
   * Processes batched DOM updates
   */
  private processUpdateQueue(): void {
    this.isProcessingQueue = true;

    this.updateQueue.forEach((updates, element) => {
      // Batch all updates for this element
      const batchedUpdates = this.mergeUpdates(updates);
      this.applyUpdates(element, batchedUpdates);
    });

    this.updateQueue.clear();
    this.isProcessingQueue = false;
    this.rafId = null;
  }

  /**
   * Merges multiple update configs for the same element
   */
  private mergeUpdates(updates: DOMUpdateConfig[]): DOMUpdateConfig {
    const merged: DOMUpdateConfig = {
      element: updates[0].element,
      updates: {},
      attributes: {},
      classes: { add: [], remove: [], toggle: [] },
      styles: {},
    };

    updates.forEach(update => {
      // Merge properties
      Object.assign(merged.updates, update.updates);

      // Merge attributes
      if (update.attributes) {
        Object.assign(merged.attributes!, update.attributes);
      }

      // Merge classes
      if (update.classes) {
        if (update.classes.add) {
          merged.classes!.add!.push(...update.classes.add);
        }
        if (update.classes.remove) {
          merged.classes!.remove!.push(...update.classes.remove);
        }
        if (update.classes.toggle) {
          merged.classes!.toggle!.push(...update.classes.toggle);
        }
      }

      // Merge styles
      if (update.styles) {
        Object.assign(merged.styles!, update.styles);
      }
    });

    return merged;
  }

  /**
   * Applies updates to DOM element
   */
  private applyUpdates(element: HTMLElement, config: DOMUpdateConfig): void {
    // Update properties
    Object.entries(config.updates).forEach(([key, value]) => {
      if (value === null) {
        delete (element as any)[key];
      } else {
        (element as any)[key] = value;
      }
    });

    // Update attributes
    if (config.attributes) {
      Object.entries(config.attributes).forEach(([key, value]) => {
        if (value === null) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, value);
        }
      });
    }

    // Update classes
    if (config.classes) {
      if (config.classes.add?.length) {
        element.classList.add(...config.classes.add);
      }
      if (config.classes.remove?.length) {
        element.classList.remove(...config.classes.remove);
      }
      if (config.classes.toggle?.length) {
        config.classes.toggle.forEach(className => {
          element.classList.toggle(className);
        });
      }
    }

    // Update styles
    if (config.styles) {
      Object.entries(config.styles).forEach(([key, value]) => {
        if (value === null) {
          element.style.removeProperty(key);
        } else {
          element.style.setProperty(key, value);
        }
      });
    }
  }

  /**
   * Creates and observes DOM mutations
   */
  observeDOM(config: DOMObserverConfig): string {
    const id = this.generateId('observer');
    const observer = new MutationObserver(config.callback);

    observer.observe(config.target, config.options || {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
    });

    this.observers.set(id, observer);
    return id;
  }

  /**
   * Disconnects DOM observer
   */
  disconnectObserver(id: string): boolean {
    const observer = this.observers.get(id);
    if (observer) {
      observer.disconnect();
      this.observers.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Animates DOM element
   */
  animateElement(config: DOMAnimationConfig): string {
    const id = this.generateId('animation');

    // Check if Web Animations API is supported
    if (!config.element.animate) {
      console.warn('Web Animations API not supported');
      return id;
    }

    const animation = config.element.animate(config.keyframes, config.options);

    if (config.onComplete) {
      animation.onfinish = config.onComplete;
    }

    this.animations.set(id, animation);
    return id;
  }

  /**
   * Cancels animation
   */
  cancelAnimation(id: string): boolean {
    const animation = this.animations.get(id);
    if (animation) {
      animation.cancel();
      this.animations.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Debounced function execution
   */
  debounce<T extends(...args: any[]) => any>(
    key: string,
    fn: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const existingTimer = this.debounceTimers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = window.setTimeout(() => {
        fn(...args);
        this.debounceTimers.delete(key);
      }, delay);

      this.debounceTimers.set(key, timer);
    };
  }

  /**
   * Throttled function execution
   */
  throttle<T extends(...args: any[]) => any>(
    key: string,
    fn: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  }

  /**
   * Efficiently creates DOM elements
   */
  createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    config?: {
      className?: string;
      id?: string;
      attributes?: Record<string, string>;
      styles?: Record<string, string>;
      textContent?: string;
      children?: HTMLElement[];
    },
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);

    if (config) {
      if (config.className) {
        element.className = config.className;
      }
      if (config.id) {
        element.id = config.id;
      }
      if (config.attributes) {
        Object.entries(config.attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });
      }
      if (config.styles) {
        Object.entries(config.styles).forEach(([key, value]) => {
          element.style.setProperty(key, value);
        });
      }
      if (config.textContent) {
        element.textContent = config.textContent;
      }
      if (config.children) {
        element.append(...config.children);
      }
    }

    return element;
  }

  /**
   * Efficiently updates multiple elements
   */
  batchUpdate(updates: DOMUpdateConfig[]): void {
    updates.forEach(update => {
      this.updateElement(update);
    });
  }

  /**
   * Gets element by selector with caching
   */
  private elementCache = new Map<string, HTMLElement>();

  getElement(selector: string, useCache = true): HTMLElement | null {
    if (useCache && this.elementCache.has(selector)) {
      return this.elementCache.get(selector)!;
    }

    const element = document.querySelector(selector) as HTMLElement;
    if (element && useCache) {
      this.elementCache.set(selector, element);
    }

    return element;
  }

  /**
   * Clears element cache
   */
  clearElementCache(): void {
    this.elementCache.clear();
  }

  /**
   * Measures element performance
   */
  measureElement(element: HTMLElement): {
    offsetWidth: number;
    offsetHeight: number;
    clientWidth: number;
    clientHeight: number;
    scrollWidth: number;
    scrollHeight: number;
    boundingRect: DOMRect;
  } {
    const rect = element.getBoundingClientRect();

    return {
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      boundingRect: rect,
    };
  }

  /**
   * Checks if element is in viewport
   */
  isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Scrolls element into view smoothly
   */
  scrollIntoView(element: HTMLElement, options?: ScrollIntoViewOptions): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
      ...options,
    });
  }

  /**
   * Focuses element with accessibility considerations
   */
  focusElement(element: HTMLElement, options?: {
    preventScroll?: boolean;
    focusVisible?: boolean;
  }): void {
    if (options?.focusVisible) {
      element.classList.add('focus-visible');
    }

    element.focus({ preventScroll: options?.preventScroll });
  }

  /**
   * Blurs element and removes focus styles
   */
  blurElement(element: HTMLElement): void {
    element.classList.remove('focus-visible');
    element.blur();
  }

  /**
   * Generates unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
  }

  /**
   * Gets statistics about DOM manager usage
   */
  getStats(): {
    eventListeners: number;
    observers: number;
    animations: number;
    pendingUpdates: number;
    cachedElements: number;
    } {
    return {
      eventListeners: this.eventListeners.size,
      observers: this.observers.size,
      animations: this.animations.size,
      pendingUpdates: this.updateQueue.size,
      cachedElements: this.elementCache.size,
    };
  }

  /**
   * Cleans up all resources
   */
  destroy(): void {
    // Clear all event listeners
    this.eventListeners.clear();
    this.eventTargets.clear();

    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();

    // Cancel all animations
    this.animations.forEach(animation => animation.cancel());
    this.animations.clear();

    // Clear update queue
    this.updateQueue.clear();

    // Cancel RAF
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Clear debounce timers
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();

    // Clear element cache
    this.elementCache.clear();
  }
}
