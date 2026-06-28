import { QueryChipsConfig, QueryChipsState, ConditionGroup, LogicalOperator, Filter } from './types';
import {
  generateId,
  filterData,
  validateField,
  getOperatorsForField,
  parseValue,
  createElement,
  isClickOutside,
  formatFilterDisplay,
  inferFieldsFromDataWithOptions,
  filtersToElasticsearchQuery,
  filtersToSQLQuery,
  filtersToMongoDBQuery,
  filtersToGraphQLQuery,
  getLogicalOperators,
  createConditionGroup,
  isConditionGroup,
} from './utils';
import { injectStyles } from './styles';
import { QueryChipsTheme, DEFAULT_THEME, applyTheme } from './themes';
import { Translation, getTranslation } from './translations';
import { QueryChipsDOMManager } from './dom-manager';

// Constants for better maintainability
const CONSTANTS = {
  BLUR_TIMEOUT: 120,
  DROPDOWN_MAX_HEIGHT: 200,
  MIN_INPUT_WIDTH: 200,
  DEFAULT_ENUM_THRESHOLD: 10,
} as const;

/**
 * QueryChips - A modern, framework-agnostic filter UI component
 *
 * This class provides a comprehensive filtering interface with:
 * - Smart input handling and keyboard navigation
 * - Advanced filtering with logical operators and groups
 * - Multiple query language support (Elasticsearch, SQL, MongoDB, GraphQL)
 * - Accessibility features and internationalization
 * - Theme support and customization
 */
export class QueryChips {
  private config!: QueryChipsConfig;
  private container!: HTMLElement;
  private inputElement!: HTMLInputElement;
  private isActive = false;
  private static instances: QueryChips[] = [];
  private static instanceCounter = 0;
  private static globalClickHandler: ((e: Event) => void) | null = null;
  private static globalClickHandlerRegistered = false;
  private instanceId: string;
  private theme!: QueryChipsTheme;
  private translation!: Translation;
  private isDestroyed = false;
  private isMounted = false;

  // DOM management
  private domManager: QueryChipsDOMManager;

  // State management
  private state!: QueryChipsState;
  private groupStack: ConditionGroup[] = [];
  private eventListeners: Array<{ target: EventTarget, type: string, handler: EventListenerOrEventListenerObject }> = [];
  private isRendering = false; // Guard against infinite render loops
  private isClickingOutside = false; // Flag to prevent refocus when clicking outside

  constructor(config: QueryChipsConfig) {
    try {
      // Generate unique instance ID
      this.instanceId = `querychips-${++QueryChips.instanceCounter}`;

      this.config = { autoApply: true, ...config };

      // Initialize DOM manager
      this.domManager = new QueryChipsDOMManager();

      // Validate configuration
      this.validateConfiguration();

      // Initialize theme and translation
      this.initializeThemeAndTranslation();

      // Initialize fields
      this.initializeFields();

      // Create DOM elements
      this.createDOMElements();

      // Initialize state
      this.initializeState();

      // Apply default filters if provided
      this.applyDefaultQuery();

      // Setup event listeners
      this.setupEventListeners();

      // Initial render
      this.render();

      // Register instance
      QueryChips.instances.push(this);

    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  /**
   * Validates the configuration
   */
  private validateConfiguration(): void {
    if (!this.config.data || !Array.isArray(this.config.data) || this.config.data.length === 0) {
      throw new Error('Data array cannot be empty');
    }
  }

  /**
   * Initializes theme and translation settings
   */
  private initializeThemeAndTranslation(): void {
    this.theme = this.config.theme ?? DEFAULT_THEME;

    if (this.config.translation) {
      this.translation = this.config.translation;
    } else {
      this.translation = getTranslation(this.config.language ?? 'en');
    }
  }

  /**
   * Initializes field configuration
   */
  private initializeFields(): void {
    if (this.config.inferFields || !this.config.fields || this.config.fields.length === 0) {
      const threshold = typeof this.config.enumThreshold === 'number'
        ? this.config.enumThreshold
        : CONSTANTS.DEFAULT_ENUM_THRESHOLD;
      this.config.fields = inferFieldsFromDataWithOptions(this.config.data, threshold);
    }

    // Check if fields array is explicitly empty (not inferred)
    if (this.config.fields && this.config.fields.length === 0 && !this.config.inferFields) {
      throw new Error('Fields array cannot be empty');
    }

    if (!this.config.fields || this.config.fields.length === 0) {
      throw new Error('No fields available for filtering');
    }

    // Validate all fields
    this.config.fields.forEach(field => {
      if (!validateField(field)) {
        throw new Error(`Invalid field configuration: ${field.key}`);
      }
    });
  }

  /**
   * Creates the main DOM elements
   */
  private createDOMElements(): void {
    this.container = this.createContainer();
    this.inputElement = this.createInput();
    this.createFilterTagsContainer();
  }

  /**
   * Creates the main container element
   */
  private createContainer(): HTMLElement {
    const container = this.domManager.createElement('div', {
      className: 'querychips-container',
      attributes: {
        'id': this.instanceId,
        'role': 'search',
        'aria-label': 'Filter data',
      },
    });
    return container;
  }

  /**
   * Creates the input element with wrapper
   */
  private createInput(): HTMLInputElement {
    const wrapper = this.domManager.createElement('div', {
      className: 'querychips-input-wrapper',
    });

    const input = this.domManager.createElement('input', {
      className: 'querychips-input',
      attributes: {
        'id': `${this.instanceId}-input`,
        'type': 'text',
        'placeholder': this.translation.placeholder.addFilter,
        'aria-label': this.translation.accessibility.filterInput,
      },
    }) as HTMLInputElement;

    const validationIcon = this.domManager.createElement('div', {
      className: 'querychips-validation-icon',
      attributes: {
        'aria-label': this.translation.accessibility.validationStatus,
      },
    });

    wrapper.append(input, validationIcon);
    this.container.appendChild(wrapper);
    return input;
  }

  /**
   * Creates the filter tags container
   */
  private createFilterTagsContainer(): void {
    const filterTagsContainer = this.domManager.createElement('div', {
      className: 'querychips-filter-tags',
      attributes: {
        'id': `${this.instanceId}-filter-tags`,
        'role': 'list',
        'aria-label': 'Filter tags',
      },
    });
    this.container.appendChild(filterTagsContainer);
  }

  /**
   * Initializes the state
   */
  private initializeState(): void {
    let filters: Filter[] = [];
    let advancedFilters: { conditions: any[]; logicalOperators: any[]; currentGroupId?: string } = {
      conditions: [],
      logicalOperators: [],
      currentGroupId: undefined,
    };

    if (this.config.defaultQuery) {
      if (Array.isArray(this.config.defaultQuery)) {
        filters = this.config.defaultQuery;
      } else if (typeof this.config.defaultQuery === 'object' && this.config.defaultQuery.conditions) {
        advancedFilters = {
          conditions: this.config.defaultQuery.conditions || [],
          logicalOperators: this.config.defaultQuery.logicalOperators || [],
          currentGroupId: this.config.defaultQuery.currentGroupId,
        };
      }
    }

    this.state = {
      filters,
      currentStep: 'field',
      inputValue: '',
      isDropdownOpen: false,
      dropdownOptions: [],
      selectedOptionIndex: 0,
      advancedFilters,
    };
  }

  /**
   * Applies default query if provided
   */
  private applyDefaultQuery(): void {
    if (this.config.defaultQuery) {
      if (Array.isArray(this.config.defaultQuery)) {
        this.state.filters = [...this.config.defaultQuery];
        this.state.advancedFilters = undefined;
      } else if (typeof this.config.defaultQuery === 'object' && this.config.defaultQuery.conditions) {
        this.state.advancedFilters = {
          conditions: this.config.defaultQuery.conditions || [],
          logicalOperators: this.config.defaultQuery.logicalOperators || [],
          currentGroupId: this.config.defaultQuery.currentGroupId,
        };
        this.state.filters = [];
      }
    }
  }

  /**
   * Sets up all event listeners
   */
  private setupEventListeners(): void {
    this.setupInputEventListeners();
    // Don't setup click outside listener here - will be done in mount()
  }

  /**
   * Sets up input-specific event listeners
   */
  private setupInputEventListeners(): void {
    // Keydown events
    const keydownHandler = (e: Event) => this.handleKeyDown(e as KeyboardEvent);
    this.inputElement.addEventListener('keydown', keydownHandler);
    this.eventListeners.push({ target: this.inputElement, type: 'keydown', handler: keydownHandler });

    // Input events
    const inputHandler = (e: Event) => this.handleInputChange((e.target as HTMLInputElement).value);
    this.inputElement.addEventListener('input', inputHandler);
    this.eventListeners.push({ target: this.inputElement, type: 'input', handler: inputHandler });

    // Focus events
    const focusHandler = (() => this.handleFocus()) as EventListener;
    this.inputElement.addEventListener('focus', focusHandler);
    this.eventListeners.push({ target: this.inputElement, type: 'focus', handler: focusHandler });

    // Blur events
    const blurHandler = (() => this.handleBlur()) as EventListener;
    this.inputElement.addEventListener('blur', blurHandler);
    this.eventListeners.push({ target: this.inputElement, type: 'blur', handler: blurHandler });

    // Click events
    const clickHandler = (() => this.handleClick()) as EventListener;
    this.inputElement.addEventListener('click', clickHandler);
    this.eventListeners.push({ target: this.inputElement, type: 'click', handler: clickHandler });
  }

  /**
   * Sets up click outside listener
   */
  private setupClickOutsideListener(): void {
    // Use a global click handler for all QueryChips instances
    if (!QueryChips.globalClickHandlerRegistered) {
      QueryChips.globalClickHandler = (e: Event) => {
        const target = e.target as Element;

        // Check all QueryChips instances
        QueryChips.instances.forEach(instance => {
          if (instance.isDestroyed) return;

          // Check if click is outside this specific instance
          const isOutsideThisInstance = isClickOutside(instance.container, e as MouseEvent);

          if (isOutsideThisInstance) {
            // Check if the click is on any QueryChips instance (including this one)
            const isAnyQueryChips = target.closest('.querychips-container');

            // Only close dropdown if click is completely outside all QueryChips instances
            if (!isAnyQueryChips) {
              // Set flag to prevent refocus
              instance.isClickingOutside = true;

              // Close dropdown and remove focus when clicking outside
              instance.state.isDropdownOpen = false;
              instance.isActive = false;

              // Remove focus from input element
              if (instance.inputElement) {
                instance.inputElement.blur();
              }

              instance.render();

              // Reset flag after a short delay
              setTimeout(() => {
                instance.isClickingOutside = false;
              }, 50);
            }
          }
        });
      };

      // Add the global event listener to document
      document.addEventListener('click', QueryChips.globalClickHandler);
      QueryChips.globalClickHandlerRegistered = true;
    }
  }

  /**
   * Handles keyboard input events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
    case 'Enter':
      event.preventDefault();
      this.handleEnter();
      break;
    case 'Escape':
      event.preventDefault();
      this.handleEscape();
      break;
    case 'Backspace':
      event.preventDefault();
      this.handleBackspace();
      break;
    case 'ArrowDown':
      event.preventDefault();
      this.handleArrowDown();
      break;
    case 'ArrowUp':
      event.preventDefault();
      this.handleArrowUp();
      break;
    case 'Tab':
      if (this.state.isDropdownOpen && this.state.dropdownOptions.length > 0) {
        event.preventDefault();
        this.selectDropdownOption(this.state.selectedOptionIndex);
      }
      break;
    }
  }

  /**
   * Handles input change events
   */
  private handleInputChange(value: string): void {
    this.state.inputValue = value;
    this.state.selectedOptionIndex = 0;

    // Update dropdown options
    this.updateDropdown();

    // Open dropdown if there are options
    if (this.state.dropdownOptions.length > 0) {
      this.state.isDropdownOpen = true;
    }

    this.render();
  }

  /**
   * Handles focus events
   */
  private handleFocus(): void {
    this.isActive = true;
    this.refocusAndOpenDropdown();
  }

  /**
   * Handles blur events
   */
  private handleBlur(): void {
    this.isActive = false;
    // Only refocus if the blur was not caused by clicking on another QueryChips instance
    // AND if the dropdown is still open (meaning it wasn't closed by click outside)
    // AND if we're not currently clicking outside
    setTimeout(() => {
      if (!this.isDestroyed && this.inputElement && this.state.isDropdownOpen && !this.isClickingOutside) {
        const activeElement = document.activeElement;
        const queryChipsContainer = activeElement?.closest('.querychips-container');
        const isFocusingOtherQueryChips = activeElement &&
          queryChipsContainer &&
          queryChipsContainer.id !== this.instanceId;

        if (!isFocusingOtherQueryChips) {
          this.keepInputFocused();
        }
      }
    }, 10);
  }

  /**
   * Handles click events
   */
  private handleClick(): void {
    this.refocusAndOpenDropdown();
  }

  /**
   * Handles Enter key
   */
  private handleEnter(): void {
    const currentState = this.state;

    if (currentState.isDropdownOpen && currentState.dropdownOptions.length > 0) {
      this.selectDropdownOption(currentState.selectedOptionIndex);
    } else if (currentState.currentStep === 'value' && currentState.inputValue.trim()) {
      this.completeFilter();
    } else if (currentState.currentStep === 'field' && currentState.inputValue.trim()) {
      // Check for group operations
      if (currentState.inputValue === '(') {
        // Prevent opening consecutive parentheses
        if (this.groupStack.length > 0) {
          return;
        }
        // Clear any selected logical operator before opening group
        this.state.selectedLogicalOperator = undefined;
        this.openGroup();
        this.state.currentStep = 'field';
        this.state.inputValue = '';
        if (this.config.autoApply) {
          this.applyFilters();
        }
        this.refocusAndOpenDropdown();
        return;
      } else if (currentState.inputValue === ')') {
        if (this.closeGroup()) {
          this.state.currentStep = 'logical';
          this.state.inputValue = '';
          if (this.config.autoApply) {
            this.applyFilters();
          }
          this.refocusAndOpenDropdown();
          return;
        }
      }
      this.handleFieldSelection();
    } else if (currentState.currentStep === 'operator' && currentState.inputValue.trim()) {
      this.handleOperatorSelection();
    } else if (currentState.currentStep === 'logical' && currentState.inputValue.trim()) {
      // Check for group operations in logical step
      if (currentState.inputValue === '(') {
        // Prevent opening consecutive parentheses
        if (this.groupStack.length > 0) {
          return;
        }
        // Clear any selected logical operator before opening group
        this.state.selectedLogicalOperator = undefined;
        this.openGroup();
        this.state.currentStep = 'field';
        this.state.inputValue = '';
        if (this.config.autoApply) {
          this.applyFilters();
        }
        this.refocusAndOpenDropdown();
        return;
      } else if (currentState.inputValue === ')') {
        if (this.closeGroup()) {
          this.state.currentStep = 'logical';
          this.state.inputValue = '';
          if (this.config.autoApply) {
            this.applyFilters();
          }
          this.refocusAndOpenDropdown();
          return;
        }
      }
      this.handleLogicalOperatorSelection();
    } else {
      this.updateDropdown();
      const state = this.state;
      if (state.dropdownOptions.length > 0) {
        this.state.isDropdownOpen = true;
        this.render();
      } else {
        // Even if no dropdown options, don't force focus to avoid conflicts
        this.render();
      }
    }
  }

  /**
   * Handles Escape key
   */
  private handleEscape(): void {
    this.resetFilterCreation();
  }

  /**
   * Handles Backspace key
   */
  private handleBackspace(): void {
    const inputValue = this.inputElement.value || this.state.inputValue;
    // If input is empty and there are filters, always remove last filter
    if (inputValue === '' && ((this.state.advancedFilters && this.state.advancedFilters.conditions.length > 0) || (this.state.filters && this.state.filters.length > 0))) {
      this.removeLastFilter();
      return;
    }
    if (inputValue === '') {
      this.goToPreviousStep();
      this.state.inputValue = '';
      if (this.inputElement) this.inputElement.value = '';
    } else if (inputValue.length === 1) {
      this.state.inputValue = '';
      if (this.inputElement) this.inputElement.value = '';
      this.removeLastFilter();
    } else {
      // Remove last character
      const newValue = inputValue.slice(0, -1);
      this.state.inputValue = newValue;
      if (this.inputElement) this.inputElement.value = newValue;

      // Update dropdown options
      this.updateDropdown();

      // Open dropdown if there are options
      if (this.state.dropdownOptions.length > 0) {
        this.state.isDropdownOpen = true;
      }

      this.render();
    }
  }

  /**
   * Handles Arrow Down key
   */
  private handleArrowDown(): void {
    if (this.state.isDropdownOpen && this.state.dropdownOptions.length > 0) {
      this.state.selectedOptionIndex = Math.min(
        this.state.dropdownOptions.length - 1,
        this.state.selectedOptionIndex + 1,
      );
      this.render();
    } else {
      // Don't force focus to avoid conflicts with other instances
      this.render();
    }
  }

  /**
   * Handles Arrow Up key
   */
  private handleArrowUp(): void {
    if (this.state.isDropdownOpen && this.state.dropdownOptions.length > 0) {
      this.state.selectedOptionIndex = Math.max(0, this.state.selectedOptionIndex - 1);
      this.render();
    } else {
      // Don't force focus to avoid conflicts with other instances
      this.render();
    }
  }

  /**
   * Handles field selection
   */
  private handleFieldSelection(): void {
    const selectedOption = this.state.dropdownOptions[this.state.selectedOptionIndex];

    if (selectedOption) {
      const field = this.config.fields?.find(f =>
        f.label === selectedOption || f.key === selectedOption,
      );

      if (field) {
        this.state.selectedField = field;
        this.state.currentStep = 'operator';
        this.state.inputValue = '';
        this.refocusAndOpenDropdown();
      }
    } else if (this.state.inputValue.trim()) {
      const field = this.config.fields?.find(f =>
        f.label.toLowerCase() === this.state.inputValue.toLowerCase() ||
        f.key.toLowerCase() === this.state.inputValue.toLowerCase(),
      );

      if (field) {
        this.state.selectedField = field;
        this.state.currentStep = 'operator';
        this.state.inputValue = '';
        this.refocusAndOpenDropdown();
      }
    }
  }

  /**
   * Handles operator selection
   */
  private handleOperatorSelection(): void {
    const selectedOption = this.state.dropdownOptions[this.state.selectedOptionIndex];

    if (selectedOption) {
      this.state.selectedOperator = selectedOption;
      this.state.currentStep = 'value';
      this.state.inputValue = '';
      this.refocusAndOpenDropdown();
    } else if (this.state.inputValue.trim()) {
      const operators = getOperatorsForField(this.state.selectedField!);
      const operator = operators.find(op =>
        op.toLowerCase() === this.state.inputValue.toLowerCase(),
      );

      if (operator) {
        this.state.selectedOperator = operator;
        this.state.currentStep = 'value';
        this.state.inputValue = '';
        this.refocusAndOpenDropdown();
      }
    }
  }

  /**
   * Handles logical operator selection
   */
  private handleLogicalOperatorSelection(): void {
    const selectedOption = this.state.dropdownOptions[this.state.selectedOptionIndex];

    if (selectedOption) {
      const logicalOperators = getLogicalOperators();
      const operator = logicalOperators.find(op => op === selectedOption) as LogicalOperator;

      if (operator) {
        this.state.selectedLogicalOperator = operator;
        this.addLogicalOperator(operator);
        this.state.currentStep = 'field';
        this.state.inputValue = '';
        // Keep selectedLogicalOperator visible until next filter is created
        this.refocusAndOpenDropdown();
      }
    } else if (this.state.inputValue.trim()) {
      const logicalOperators = getLogicalOperators();
      const operator = logicalOperators.find(op =>
        op.toLowerCase() === this.state.inputValue.toLowerCase(),
      ) as LogicalOperator;

      if (operator) {
        this.state.selectedLogicalOperator = operator;
        this.addLogicalOperator(operator);
        this.state.currentStep = 'field';
        this.state.inputValue = '';
        // Keep selectedLogicalOperator visible until next filter is created
        this.refocusAndOpenDropdown();
      }
    }
  }

  /**
   * Selects a dropdown option
   */
  private selectDropdownOption(index: number): void {
    const selectedOption = this.state.dropdownOptions[index];

    if (!selectedOption) return;

    // Set the selected option index before handling the selection
    this.state.selectedOptionIndex = index;

    // Handle parentheses selection
    if (selectedOption === '(') {
      // Prevent opening consecutive parentheses
      if (this.groupStack.length > 0) {
        return;
      }
      // Clear any selected logical operator before opening group
      this.state.selectedLogicalOperator = undefined;
      this.openGroup();
      this.state.currentStep = 'field';
      this.state.inputValue = '';
      if (this.config.autoApply) {
        this.applyFilters();
      }
      this.refocusAndOpenDropdown();
      return;
    } else if (selectedOption === ')') {
      if (this.closeGroup()) {
        this.state.currentStep = 'logical';
        this.state.inputValue = '';
        if (this.config.autoApply) {
          this.applyFilters();
        }
        this.refocusAndOpenDropdown();
        return;
      } else {
        return;
      }
    }

    switch (this.state.currentStep) {
    case 'field':
      this.handleFieldSelection();
      break;
    case 'operator':
      this.handleOperatorSelection();
      break;
    case 'value':
      this.state.inputValue = selectedOption;
      this.state.isDropdownOpen = false;
      this.state.dropdownOptions = [];
      this.state.selectedOptionIndex = 0;
      this.completeFilter();
      break;
    case 'logical':
      this.handleLogicalOperatorSelection();
      break;
    }
  }

  /**
   * Completes filter creation
   */
  private completeFilter(): void {
    if (!this.state.selectedField || !this.state.selectedOperator || !this.state.inputValue.trim()) {
      return;
    }

    const filter = {
      id: generateId(),
      field: this.state.selectedField.key,
      operator: this.state.selectedOperator,
      value: parseValue(this.state.inputValue.trim(), this.state.selectedField),
    };

    if (!this.state.advancedFilters) {
      this.state.advancedFilters = { conditions: [], logicalOperators: [] };
    }

    // Add filter to the current group if we're inside a group, otherwise to top-level conditions
    if (this.groupStack.length > 0 && this.state.advancedFilters.currentGroupId) {
      // Find the current group and add the filter to it
      const currentGroup = this.groupStack[this.groupStack.length - 1];
      if (currentGroup && currentGroup.id === this.state.advancedFilters.currentGroupId) {
        currentGroup.conditions.push(filter);
      }
    } else {
      // Add to top-level conditions
      this.state.advancedFilters.conditions.push(filter);
    }

    // Reset for next filter
    this.state.selectedField = undefined;
    this.state.selectedOperator = undefined;
    this.state.selectedLogicalOperator = undefined; // Reset after filter is completed
    this.state.inputValue = '';
    this.state.currentStep = 'logical';

    if (this.config.autoApply) {
      this.applyFilters();
    }

    this.refocusAndOpenDropdown();
  }

  /**
   * Goes to previous step
   */
  private goToPreviousStep(): void {
    switch (this.state.currentStep) {
    case 'operator':
      this.state.currentStep = 'field';
      this.state.selectedField = undefined;
      this.state.selectedLogicalOperator = undefined;
      this.state.inputValue = '';
      break;
    case 'value':
      this.state.currentStep = 'operator';
      this.state.selectedOperator = undefined;
      this.state.selectedLogicalOperator = undefined;
      this.state.inputValue = '';
      break;
    case 'logical':
      this.state.currentStep = 'value';
      this.state.selectedLogicalOperator = undefined;
      this.state.inputValue = '';
      break;
    case 'field':
      // Remove last filter if exists (advanced or simple)
      this.removeLastFilter();
      return; // removeLastFilter handles its own rendering
    }
    this.refocusAndOpenDropdown();
  }

  /**
   * Removes the last filter
   */
  private removeLastFilter(): void {
    let removed = false;
    // Prioritize simple filters
    if (this.state.filters && this.state.filters.length > 0) {
      this.state.filters.pop();
      if (this.state.filters.length === 0) {
        this.state.currentStep = 'field';
      }
      removed = true;
    } else if (this.state.advancedFilters && this.state.advancedFilters.conditions.length > 0) {
      this.state.advancedFilters.conditions.pop();
      if (this.state.advancedFilters.logicalOperators.length > 0) {
        this.state.advancedFilters.logicalOperators.pop();
      }
      if (this.state.advancedFilters.conditions.length === 0) {
        this.state.currentStep = 'field';
      }
      removed = true;
    }
    if (removed) {
      this.state.inputValue = '';
      if (this.inputElement) this.inputElement.value = '';
      if (this.config.autoApply) {
        this.applyFilters();
      }
      this.refocusAndOpenDropdown();
    }
  }

  /**
   * Resets filter creation
   */
  private resetFilterCreation(): void {
    this.state.currentStep = 'field';
    this.state.inputValue = '';
    this.state.selectedField = undefined;
    this.state.selectedOperator = undefined;
    this.state.selectedLogicalOperator = undefined;
    this.refocusAndOpenDropdown();
  }

  /**
   * Updates dropdown options
   */
  private updateDropdown(): void {
    let options: string[] = [];

    switch (this.state.currentStep) {
    case 'field':
      options = this.updateFieldDropdown(this.state.inputValue);
      break;
    case 'operator':
      options = this.updateOperatorDropdown(this.state.inputValue, this.state.selectedField);
      break;
    case 'value':
      options = this.updateValueDropdown(this.state.inputValue, this.state.selectedField);
      break;
    case 'logical':
      options = this.updateLogicalDropdown(this.state.inputValue);
      break;
    }

    this.state.dropdownOptions = options;
    this.state.isDropdownOpen = options.length > 0;
    this.state.selectedOptionIndex = 0;
  }

  /**
   * Updates field dropdown
   */
  private updateFieldDropdown(inputValue: string): string[] {
    if (!this.config.fields) return [];

    const filteredFields = this.config.fields.filter(field =>
      field.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      field.key.toLowerCase().includes(inputValue.toLowerCase()),
    );

    const fieldOptions = filteredFields.map(field => field.label);

    // Add opening parenthesis option if input matches and not already in a group
    const parenthesesOptions: string[] = [];

    if ((inputValue === '' || '('.includes(inputValue.toLowerCase())) && this.groupStack.length === 0) {
      parenthesesOptions.push('(');
    }

    return [...parenthesesOptions, ...fieldOptions];
  }

  /**
   * Updates operator dropdown
   */
  private updateOperatorDropdown(inputValue: string, selectedField?: any): string[] {
    if (!selectedField) return [];

    const operators = getOperatorsForField(selectedField);
    return operators.filter(op =>
      op.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }

  /**
   * Updates value dropdown
   */
  private updateValueDropdown(inputValue: string, selectedField?: any): string[] {
    if (!selectedField) return [];

    if (selectedField.type === 'enum' && selectedField.values) {
      // Always use string values for enums
      return selectedField.values.map(String).filter((value: string) =>
        value.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    if (selectedField.type === 'boolean') {
      // Use translation for boolean values, fallback to 'True'/'False'
      const trueLabel = this.translation.booleanValues?.true ? this.translation.booleanValues.true : 'True';
      const falseLabel = this.translation.booleanValues?.false ? this.translation.booleanValues.false : 'False';
      return [trueLabel, falseLabel].filter(value =>
        value.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    return [];
  }

  /**
   * Updates logical dropdown
   */
  private updateLogicalDropdown(inputValue: string): string[] {
    const logicalOperators = getLogicalOperators();
    const operatorOptions = logicalOperators.filter(op =>
      op.toLowerCase().includes(inputValue.toLowerCase()),
    );

    // Only show closing parenthesis if there are open groups
    const parenthesesOptions: string[] = [];
    if ((inputValue === '' || ')'.includes(inputValue.toLowerCase())) && this.groupStack.length > 0) {
      parenthesesOptions.push(')');
    }

    return [...parenthesesOptions, ...operatorOptions];
  }

  /**
   * Main render method
   */
  private render(): void {
    if (this.isDestroyed || this.isRendering) return;

    this.isRendering = true;
    try {
      this.clearContainer();
      this.renderTagsAndDropdown();
      this.updateInputPlaceholder();
      this.updateValidationIcon();
    } finally {
      this.isRendering = false;
    }
  }

  /**
   * Clears the container while preserving essential elements
   */
  private clearContainer(): void {
    const inputWrapper = this.container.querySelector('.querychips-input-wrapper');
    const filterTagsContainer = this.container.querySelector('.querychips-filter-tags');

    let node = this.container.firstChild;
    while (node) {
      const next = node.nextSibling;
      if (node !== inputWrapper && node !== filterTagsContainer) {
        this.container.removeChild(node);
      }
      node = next;
    }

    if (inputWrapper) {
      inputWrapper.querySelectorAll('.querychips-dropdown').forEach(d => d.remove());
    }
  }

  /**
   * Renders tags and dropdown
   */
  private renderTagsAndDropdown(): void {
    const inputWrapper = this.container.querySelector('.querychips-input-wrapper');

    if (this.state.advancedFilters && this.state.advancedFilters.conditions.length > 0) {
      this.renderAdvancedTags(inputWrapper);
    } else {
      this.renderSimpleTags(inputWrapper);
    }

    this.renderDropdown(inputWrapper);
  }

  /**
   * Renders simple filter tags
   */
  private renderSimpleTags(inputWrapper: Element | null): void {
    if (!this.state.filters) return;

    for (let i = 0; i < this.state.filters.length; i++) {
      const filter = this.state.filters[i];
      if (i > 0) {
        const logicalTag = this.createTag(this.translation.logicalOperators.AND);
        this.container.insertBefore(logicalTag, inputWrapper);
      }
      const tag = this.createTag(formatFilterDisplay(filter, this.config.fields || []));
      this.container.insertBefore(tag, inputWrapper);
    }

    this.renderInProgressTags(inputWrapper);
  }

  /**
   * Renders advanced filter tags
   */
  private renderAdvancedTags(inputWrapper: Element | null): void {
    if (!this.state.advancedFilters) return;

    for (let i = 0; i < this.state.advancedFilters.conditions.length; i++) {
      const condition = this.state.advancedFilters.conditions[i];

      if (i > 0 && this.state.advancedFilters.logicalOperators[i - 1]) {
        const translatedOperator = this.state.advancedFilters.logicalOperators[i - 1] === 'AND'
          ? this.translation.logicalOperators.AND
          : this.translation.logicalOperators.OR;
        const logicalTag = this.createTag(translatedOperator);
        this.container.insertBefore(logicalTag, inputWrapper);
      }

      if (isConditionGroup(condition)) {
        this.renderConditionGroup(condition, inputWrapper, [], 0);
      } else {
        const tag = this.createTag(formatFilterDisplay(condition, this.config.fields || []));
        this.container.insertBefore(tag, inputWrapper);
      }
    }

    if (this.state.selectedLogicalOperator) {
      const translatedOperator = this.state.selectedLogicalOperator === 'AND'
        ? this.translation.logicalOperators.AND
        : this.translation.logicalOperators.OR;
      const logicalTag = this.createTag(translatedOperator);
      this.container.insertBefore(logicalTag, inputWrapper);
    }

    this.renderInProgressTags(inputWrapper);
  }

  /**
   * Renders in-progress tags (field/operator being selected)
   */
  private renderInProgressTags(inputWrapper: Element | null): void {
    let currentFieldTag: HTMLElement | null = null;
    if (this.state.selectedField) {
      currentFieldTag = this.createTag(this.state.selectedField.label);
      this.container.insertBefore(currentFieldTag, inputWrapper);
    }
    if (this.state.selectedOperator) {
      const operatorTag = this.createTag(this.state.selectedOperator);
      if (currentFieldTag) {
        this.container.insertBefore(operatorTag, currentFieldTag.nextSibling);
      } else {
        this.container.insertBefore(operatorTag, inputWrapper);
      }
    }
  }

  /**
   * Renders a condition group
   */
  private renderConditionGroup(group: ConditionGroup, inputWrapper: Element | null, groupStack: ConditionGroup[], depth = 0): void {
    // Prevent infinite loops by limiting recursion depth
    if (depth > 10) {
      console.warn('Maximum group nesting depth exceeded, stopping recursion');
      return;
    }

    // Check for circular references
    if (groupStack.some(stackGroup => stackGroup.id === group.id)) {
      console.warn('Circular reference detected in group structure, stopping recursion');
      return;
    }

    // Always show opening parenthesis for groups
    const startParen = this.createTag(this.translation.groupOperators.openGroup);
    this.container.insertBefore(startParen, inputWrapper);

    for (let i = 0; i < group.conditions.length; i++) {
      const condition = group.conditions[i];

      if (i > 0) {
        const logicalOperator = group.logicalOperators?.[i - 1] ?? group.operator;
        const translatedOperator = logicalOperator === 'AND'
          ? this.translation.logicalOperators.AND
          : this.translation.logicalOperators.OR;
        const logicalTag = this.createTag(translatedOperator);
        this.container.insertBefore(logicalTag, inputWrapper);
      }

      if (isConditionGroup(condition)) {
        this.renderConditionGroup(condition, inputWrapper, [...groupStack, group], depth + 1);
      } else {
        const tag = this.createTag(formatFilterDisplay(condition, this.config.fields || []));
        this.container.insertBefore(tag, inputWrapper);
      }
    }

    // Only show closing parenthesis if the group is closed (not in current group stack)
    const isCurrentGroup = this.state.advancedFilters?.currentGroupId === group.id;
    if (!isCurrentGroup) {
      const endParen = this.createTag(this.translation.groupOperators.closeGroup);
      this.container.insertBefore(endParen, inputWrapper);
    }
  }

  /**
   * Renders the dropdown
   */
  private renderDropdown(inputWrapper: Element | null): void {
    if (!this.state.isDropdownOpen || this.state.dropdownOptions.length === 0 || !inputWrapper) return;

    const dropdown = createElement('div', 'querychips-dropdown');
    dropdown.setAttribute('id', `${this.instanceId}-dropdown`);
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', this.translation.accessibility.dropdownList);

    this.state.dropdownOptions.forEach((option, index) => {
      const optionElement = createElement('div', 'querychips-dropdown-option');
      optionElement.textContent = option;
      optionElement.setAttribute('role', 'option');
      optionElement.setAttribute('aria-selected', index === this.state.selectedOptionIndex ? 'true' : 'false');

      if (index === this.state.selectedOptionIndex) {
        optionElement.classList.add('selected');
      }

      optionElement.addEventListener('mousedown', () => {
        this.selectDropdownOption(index);
      });

      dropdown.appendChild(optionElement);
    });

    inputWrapper.appendChild(dropdown);
  }

  /**
   * Creates a tag element
   */
  private createTag(text: string): HTMLElement {
    const tag = this.domManager.createElement('div', {
      className: 'querychips-tag',
      textContent: text,
      attributes: {
        'data-instance': this.instanceId,
      },
    });
    return tag;
  }

  /**
   * Updates input placeholder
   */
  private updateInputPlaceholder(): void {
    let placeholder = this.translation.placeholder.addFilter;

    if (this.state.selectedField) {
      placeholder = this.getValuePlaceholder();
    }

    this.domManager.updateElement({
      element: this.inputElement,
      updates: {
        placeholder: placeholder,
      },
    });
  }

  /**
   * Gets the value placeholder based on current state
   */
  private getValuePlaceholder(): string {
    if (!this.state.selectedField) return this.translation.placeholder.addFilter;

    switch (this.state.selectedField.type) {
    case 'string':
      return this.translation.placeholder.enterValue;
    case 'number':
      return this.translation.placeholder.enterValue;
    case 'boolean':
      return this.translation.placeholder.selectValue;
    case 'enum':
      return this.translation.placeholder.selectValue;
    default:
      return this.translation.placeholder.enterValue;
    }
  }

  /**
   * Updates validation icon
   */
  private updateValidationIcon(): void {
    const validationIcon = this.container.querySelector('.querychips-validation-icon') as HTMLElement;
    if (!validationIcon) return;

    const validationState = this.getQueryValidationState();
    this.domManager.updateElement({
      element: validationIcon,
      updates: {
        className: `querychips-validation-icon ${validationState}`,
      },
    });
  }

  /**
   * Gets the query validation state
   */
  private getQueryValidationState(): string {
    if (!this.state.selectedField) {
      return 'empty';
    }

    if (!this.state.selectedOperator) {
      return 'incomplete';
    }

    if (this.state.currentStep === 'value' && !this.state.inputValue.trim()) {
      return 'incomplete';
    }

    return 'valid';
  }

  /**
   * Applies filters and triggers callbacks
   */
  private applyFilters(): void {
    if (this.isDestroyed) return;

    const filteredData = filterData(
      this.config.data,
      this.state.filters,
      this.config.fields ?? [],
      this.state.advancedFilters,
    );

    if (this.config.onQueryChange) {
      const queries = this.generateQueries();
      this.config.onQueryChange(queries, this.state);
    }

    this.config.onChange?.(filteredData, this.state);
  }

  /**
   * Generates queries for different languages
   */
  private generateQueries(): Record<string, unknown> {
    const queryLanguages = this.config.queryLanguages ?? ['elasticsearch'];
    const queries: Record<string, unknown> = {};

    queryLanguages.forEach(language => {
      switch (language) {
      case 'elasticsearch':
        queries.elasticsearch = filtersToElasticsearchQuery(
          this.state.filters,
          this.config.fields ?? [],
          this.state.advancedFilters,
        );
        break;
      case 'sql':
        queries.sql = filtersToSQLQuery(
          this.state.filters,
          this.config.fields ?? [],
          this.state.advancedFilters,
        );
        break;
      case 'mongodb':
        queries.mongodb = filtersToMongoDBQuery(
          this.state.filters,
          this.config.fields ?? [],
          this.state.advancedFilters,
        );
        break;
      case 'graphql':
        queries.graphql = filtersToGraphQLQuery(
          this.state.filters,
          this.config.fields ?? [],
          this.state.advancedFilters,
        );
        break;
      }
    });

    return queries;
  }

  /**
   * Cleans up resources
   */
  private cleanup(): void {
    // Remove all event listeners
    for (const { target, type, handler } of this.eventListeners) {
      target.removeEventListener(type, handler);
    }
    this.eventListeners = [];

    // Destroy DOM manager
    if (this.domManager) {
      this.domManager.destroy();
    }

    // Remove container from DOM
    if (this.container?.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  /**
   * Mounts the component to a DOM element
   */
  public mount(element: HTMLElement): void {
    if (this.isDestroyed) return;

    if (!element) {
      throw new Error('Container element is required');
    }

    if (this.theme.mode !== 'none') {
      injectStyles();
    }

    applyTheme(this.container, this.theme);
    element.appendChild(this.container);
    this.isMounted = true;

    // Setup click outside listener after mounting
    this.setupClickOutsideListener();

    // Update state to reflect mounted status
    this.state.isDropdownOpen = false;
    this.state.currentStep = 'field';

    if (this.config.autoApply) {
      this.applyFilters();
    }

  }

  /**
   * Destroys the component instance
   */
  public destroy(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;

    // Remove from instances array
    const index = QueryChips.instances.indexOf(this);
    if (index > -1) {
      QueryChips.instances.splice(index, 1);
    }

    // Clean up DOM elements with this instance ID
    const elementsToRemove = document.querySelectorAll(`[id^="${this.instanceId}"]`);
    elementsToRemove.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    // Remove global click handler if this is the last instance
    if (QueryChips.instances.length === 0 && QueryChips.globalClickHandler && QueryChips.globalClickHandlerRegistered) {
      document.removeEventListener('click', QueryChips.globalClickHandler);
      QueryChips.globalClickHandler = null;
      QueryChips.globalClickHandlerRegistered = false;
    }

    this.cleanup();
  }

  /**
   * Gets the current state
   */
  public getState(): QueryChipsState {
    return { ...this.state };
  }

  /**
   * Sets filters programmatically
   */
  public setFilters(filters: Filter[]): void {
    if (this.isDestroyed) return;

    this.state.filters = [...filters];
    this.render();
    if (this.config.autoApply) {
      this.applyFilters();
    }
  }

  /**
   * Clears all filters
   */
  public clearFilters(): void {
    if (this.isDestroyed) return;

    this.state.filters = [];
    if (this.state.advancedFilters) {
      this.state.advancedFilters.conditions = [];
      this.state.advancedFilters.logicalOperators = [];
    }
    this.groupStack = [];
    if (this.config.autoApply) {
      this.applyFilters();
    }
    this.refocusAndOpenDropdown();
  }

  /**
   * Updates the configuration
   */
  public updateConfig(newConfig: Partial<QueryChipsConfig>): void {
    if (this.isDestroyed) return;

    this.config = { ...this.config, ...newConfig };

    if (newConfig.theme) {
      this.theme = newConfig.theme;
      if (this.isMounted) {
        applyTheme(this.container, this.theme);
      }
    }

    if (newConfig.translation) {
      this.translation = newConfig.translation;
    } else if (newConfig.language) {
      this.translation = getTranslation(newConfig.language);
    }

    if (this.config.inferFields || !this.config.fields || this.config.fields.length === 0) {
      const threshold = typeof this.config.enumThreshold === 'number' ? this.config.enumThreshold : CONSTANTS.DEFAULT_ENUM_THRESHOLD;
      this.config.fields = inferFieldsFromDataWithOptions(this.config.data, threshold);
    }

    if (!this.config.fields) {
      throw new Error('Fields could not be inferred from data.');
    }

    this.config.fields.forEach(field => {
      if (!validateField(field)) {
        throw new Error(`Invalid field configuration: ${field.key}`);
      }
    });

    if (newConfig.defaultQuery) {
      if (Array.isArray(newConfig.defaultQuery)) {
        this.state.filters = [...newConfig.defaultQuery];
        this.state.advancedFilters = undefined;
      } else if (typeof newConfig.defaultQuery === 'object' && newConfig.defaultQuery.conditions) {
        this.state.advancedFilters = {
          conditions: newConfig.defaultQuery.conditions || [],
          logicalOperators: newConfig.defaultQuery.logicalOperators || [],
          currentGroupId: newConfig.defaultQuery.currentGroupId,
        };
        this.state.filters = [];
      }
    }

    this.render();
    if (this.config.autoApply || newConfig.defaultQuery) {
      this.applyFilters();
    }
  }

  /**
   * Updates the theme
   */
  public updateTheme(theme: QueryChipsTheme): void {
    if (this.isDestroyed) return;

    this.theme = theme;
    if (this.isMounted) {
      applyTheme(this.container, this.theme);
    }
    this.render();
  }

  /**
   * Updates the translation language
   */
  public updateTranslation(language: string): void {
    if (this.isDestroyed) return;

    this.translation = getTranslation(language);
    this.render();
  }

  /**
   * Updates with custom translation
   */
  public updateTranslationCustom(translation: Translation): void {
    if (this.isDestroyed) return;

    this.translation = translation;
    this.render();
  }

  /**
   * Opens a new group
   */
  private openGroup(operator: LogicalOperator = 'AND'): void {
    const group = createConditionGroup(operator);
    this.groupStack.push(group);

    if (!this.state.advancedFilters) {
      this.state.advancedFilters = { conditions: [], logicalOperators: [] };
    }

    // Add the group to conditions and set as current
    this.state.advancedFilters.conditions.push(group);
    this.state.advancedFilters.currentGroupId = group.id;

  }

  /**
   * Closes the current group
   */
  private closeGroup(): boolean {
    if (this.groupStack.length === 0) {
      return false;
    }

    // Remove the current group from the stack
    this.groupStack.pop();

    // Update the current group ID
    if (this.groupStack.length === 0) {
      // No more groups in stack, clear the current group ID
      if (this.state.advancedFilters) {
        this.state.advancedFilters.currentGroupId = undefined;
      }
    } else {
      // Set current group ID to the top group in stack
      if (this.state.advancedFilters) {
        this.state.advancedFilters.currentGroupId = this.groupStack[this.groupStack.length - 1].id;
      }
    }

    return true;
  }

  /**
   * Adds a logical operator
   */
  private addLogicalOperator(operator: LogicalOperator): void {
    if (!this.state.advancedFilters) {
      this.state.advancedFilters = { conditions: [], logicalOperators: [] };
    }

    // Add logical operator to the current group if we're inside a group, otherwise to top-level logical operators
    if (this.groupStack.length > 0 && this.state.advancedFilters.currentGroupId) {
      // Find the current group and add the logical operator to it
      const currentGroup = this.groupStack[this.groupStack.length - 1];
      if (currentGroup && currentGroup.id === this.state.advancedFilters.currentGroupId) {
        if (!currentGroup.logicalOperators) {
          currentGroup.logicalOperators = [];
        }
        currentGroup.logicalOperators.push(operator);
      }
    } else {
      // Add to top-level logical operators
      this.state.advancedFilters.logicalOperators.push(operator);
    }
  }

  public getEventListenersForTest(): Array<{ target: EventTarget, type: string, handler: EventListenerOrEventListenerObject }> {
    return this.eventListeners;
  }

  // Expose cleanupFunctions for testability
  public get cleanupFunctions(): (() => void)[] {
    return this.eventListeners.map(({ target, type, handler }) => () => {
      target.removeEventListener(type, handler);
    });
  }

  /**
   * Gets DOM manager statistics
   */
  public getDOMStats() {
    return this.domManager.getStats();
  }

  /**
   * Refocuses input and opens dropdown
   */
  private refocusAndOpenDropdown(): void {
    // Clear input value
    this.state.inputValue = '';
    if (this.inputElement) {
      this.inputElement.value = '';
    }

    // Focus the input element (only when user action requires it)
    if (this.inputElement) {
      this.domManager.focusElement(this.inputElement, { focusVisible: true });
    }

    // Update dropdown options
    this.updateDropdown();

    // Open dropdown if there are options
    if (this.state.dropdownOptions.length > 0) {
      this.state.isDropdownOpen = true;
      this.state.selectedOptionIndex = 0;
    }

    this.render();
  }

  /**
   * Always keeps input focused
   */
  private keepInputFocused(): void {
    // Focus the input element
    if (this.inputElement) {
      this.domManager.focusElement(this.inputElement, { focusVisible: true });
    }
  }
}
