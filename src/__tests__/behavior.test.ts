import { QueryChips } from '../querychips';
import { Field, Filter } from '../types';

// Mock DOM environment
document.body.innerHTML = '<div id="test-container"></div>';

describe('QueryChips Behavior Tests', () => {
  let container: HTMLElement;
  let queryChips: QueryChips;

  const sampleData = [
    { id: 1, name: 'John Doe', department: 'Engineering', status: 'Active', experience: 5, salary: 85000, location: 'San Francisco', remote: true },
    { id: 2, name: 'Jane Smith', department: 'Design', status: 'Active', experience: 3, salary: 75000, location: 'New York', remote: false },
    { id: 3, name: 'Bob Johnson', department: 'Engineering', status: 'Inactive', experience: 7, salary: 95000, location: 'Seattle', remote: true },
    { id: 4, name: 'Alice Brown', department: 'Product', status: 'Active', experience: 4, salary: 80000, location: 'Austin', remote: true },
    { id: 5, name: 'Charlie Wilson', department: 'Marketing', status: 'Active', experience: 2, salary: 65000, location: 'Chicago', remote: false },
  ];

  const sampleFields: Field[] = [
    { key: 'department', label: 'Department', type: 'enum', values: ['Engineering', 'Design', 'Product', 'Marketing'] },
    { key: 'status', label: 'Status', type: 'enum', values: ['Active', 'Inactive'] },
    { key: 'experience', label: 'Experience', type: 'number' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'salary', label: 'Salary', type: 'number' },
    { key: 'remote', label: 'Remote', type: 'boolean' },
  ];

  beforeEach(() => {
    container = document.getElementById('test-container')!;
    container.innerHTML = '';

    queryChips = new QueryChips({
      data: sampleData,
      fields: sampleFields,
      autoApply: false,
    });
    queryChips.mount(container);
  });

  afterEach(() => {
    queryChips.destroy();
  });

  describe('Keyboard Navigation', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = container.querySelector('.querychips-input') as HTMLInputElement;
      input.focus();
    });

    test('should handle Enter key to complete filter creation', () => {
      // Type a field name
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Press Enter to select the field
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      const state = queryChips.getState();
      expect(state.selectedField?.label).toBe('Department');
      expect(state.currentStep).toBe('operator');
    });

    test('should handle Escape key to reset filter creation', () => {
      // Start creating a filter
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Press Escape to reset
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      const state = queryChips.getState();
      expect(state.selectedField).toBeUndefined();
      expect(state.currentStep).toBe('field');
      expect(state.inputValue).toBe('');
    });

    test('should handle Arrow keys for dropdown navigation', () => {
      // Open dropdown by typing and ensuring it's open
      input.value = 'a'; // 'a' matches multiple fields (e.g., 'Department', 'Salary', 'Name')
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Ensure dropdown is open and has at least two options
      let state = queryChips.getState();
      expect(state.isDropdownOpen).toBe(true);
      expect(state.dropdownOptions.length).toBeGreaterThan(1);

      // Navigate down
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      state = queryChips.getState();
      expect(state.selectedOptionIndex).toBe(1);

      // Navigate up
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      state = queryChips.getState();
      expect(state.selectedOptionIndex).toBe(0);
    });

    test('should handle Backspace when input is empty', () => {
      // Create a filter first
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Clear input and press backspace
      input.value = '';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));

      const state = queryChips.getState();
      // After backspace, the filter should be removed and we should be back to field step
      expect(state.currentStep).toBe('field');
      expect(state.advancedFilters?.conditions.length).toBe(0);
    });
  });

  describe('Backspace Behavior', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = container.querySelector('.querychips-input') as HTMLInputElement;
      input.focus();
    });

    test('should remove last filter when backspace is pressed on empty input', () => {
      // Create a filter
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Clear input and press backspace
      input.value = '';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));

      const state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(0);
    });

    test('should remove multiple filters with multiple backspace presses', () => {
      // Create first filter
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Add logical operator
      input.value = 'AND';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Create second filter
      input.value = 'Status';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Active';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      let state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(2);

      // Press backspace multiple times to remove everything
      for (let i = 0; i < 4; i++) {
        input.value = '';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      }

      state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(0);
      expect(state.currentStep).toBe('field');
    });

    test('should handle complex backspace behavior with groups and multiple filters', () => {
      // Create a complex query: (Department = Engineering AND Status = Active) OR Salary > 50000

      // Open group
      input.value = '(';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Add first filter in group
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Add AND operator
      input.value = 'AND';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Add second filter in group
      input.value = 'Status';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Active';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Close group
      input.value = ')';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Add OR operator
      input.value = 'OR';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Add third filter outside group
      input.value = 'Salary';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '>';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '50000';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      let state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(2); // Group + filter

      // Press backspace multiple times to remove everything
      for (let i = 0; i < 8; i++) {
        input.value = '';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      }

      state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(0);
      expect(state.currentStep).toBe('field');
    });

    test('should handle backspace with groups', () => {
      // Create a group
      input.value = '(';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Add filter to group
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Close group
      input.value = ')';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      let state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(1);

      // Press backspace to remove group
      input.value = '';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));

      state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(0);
    });

    test('should handle backspace when no filters exist', () => {
      // Press backspace with no filters
      input.value = '';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));

      const state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(0);
      expect(state.currentStep).toBe('field');
    });
  });

  describe('Filter Creation Flow', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = container.querySelector('.querychips-input') as HTMLInputElement;
      input.focus();
    });

    test('should complete full filter creation flow', () => {
      // Step 1: Select field
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      let state = queryChips.getState();
      expect(state.selectedField?.label).toBe('Department');
      expect(state.currentStep).toBe('operator');

      // Step 2: Select operator
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      state = queryChips.getState();
      expect(state.selectedOperator).toBe('=');
      expect(state.currentStep).toBe('value');

      // Step 3: Enter value
      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(1);
      expect(state.currentStep).toBe('logical');
    });

    test('should handle enum field with dropdown values', () => {
      // Select enum field
      input.value = 'Status';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Should show dropdown with enum values
      let state = queryChips.getState();
      expect(state.dropdownOptions).toContain('Active');
      expect(state.dropdownOptions).toContain('Inactive');

      // Select value from dropdown
      input.value = 'Active';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(1);
    });

    test('should handle string field with free text input', () => {
      // Select string field
      input.value = 'Name';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      input.value = 'contains';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Enter free text value
      input.value = 'John';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      const state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(1);
    });
  });

  describe('Group Operations', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = container.querySelector('.querychips-input') as HTMLInputElement;
      input.focus();
    });

    test('should create and close groups', () => {
      // Open group
      input.value = '(';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      let state = queryChips.getState();
      // Access private groupStack property for testing
      const groupStack = (queryChips as any).groupStack;
      expect(groupStack.length).toBe(1);

      // Add filter to group
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Close group
      input.value = ')';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      state = queryChips.getState();
      expect((queryChips as any).groupStack.length).toBe(0);
      expect(state.advancedFilters?.conditions.length).toBe(1);
    });

    test('should handle nested groups', () => {
      // Open outer group
      input.value = '(';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Add filter to outer group
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Add logical operator
      input.value = 'AND';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Open inner group
      input.value = '(';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      let state = queryChips.getState();
      expect((queryChips as any).groupStack.length).toBe(1);

      // Add filter to inner group
      input.value = 'Status';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Active';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Close inner group
      input.value = ')';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Close outer group
      input.value = ')';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      state = queryChips.getState();
      expect((queryChips as any).groupStack.length).toBe(0);
      // The conditions might include both the outer group and the inner group
      expect(state.advancedFilters?.conditions.length).toBeGreaterThan(0);
    });
  });

  describe('Logical Operators', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = container.querySelector('.querychips-input') as HTMLInputElement;
      input.focus();
    });

    test('should handle AND operator between filters', () => {
      // Create first filter
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Now we're in logical step, select AND operator
      input.value = 'AND';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      let state = queryChips.getState();
      // The logical operator should be selected but not yet added to the array
      expect(state.selectedLogicalOperator).toBe('AND');
      expect(state.currentStep).toBe('field');

      // Create second filter to trigger the logical operator to be added
      input.value = 'Status';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Active';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(2);
      expect(state.advancedFilters?.logicalOperators.length).toBe(1);
      expect(state.advancedFilters?.logicalOperators[0]).toBe('AND');
    });

    test('should handle OR operator between filters', () => {
      // Create first filter
      input.value = 'Department';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Engineering';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Now we're in logical step, select OR operator
      input.value = 'OR';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      let state = queryChips.getState();
      // The logical operator should be selected but not yet added to the array
      expect(state.selectedLogicalOperator).toBe('OR');
      expect(state.currentStep).toBe('field');

      // Create second filter to trigger the logical operator to be added
      input.value = 'Status';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.value = 'Active';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      state = queryChips.getState();
      expect(state.advancedFilters?.logicalOperators.length).toBe(1);
      expect(state.advancedFilters?.logicalOperators[0]).toBe('OR');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = container.querySelector('.querychips-input') as HTMLInputElement;
      input.focus();
    });

    test('should handle rapid key presses', () => {
      // Rapidly press keys
      for (let i = 0; i < 10; i++) {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      }

      const state = queryChips.getState();
      expect(state.selectedOptionIndex).toBeGreaterThanOrEqual(0);
    });

    test('should handle invalid input gracefully', () => {
      // Try to enter invalid field
      input.value = 'InvalidField';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      const state = queryChips.getState();
      expect(state.selectedField).toBeUndefined();
      expect(state.currentStep).toBe('field');
    });

    test('should handle empty input submissions', () => {
      // Try to submit empty input
      input.value = '';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      const state = queryChips.getState();
      expect(state.currentStep).toBe('field');
    });

    test('should handle focus and blur events', () => {
      // Focus event with content to trigger dropdown
      input.value = 'D';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      let state = queryChips.getState();
      expect(state.isDropdownOpen).toBe(true);

      // Blur event
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      // Wait for blur timeout
      setTimeout(() => {
        state = queryChips.getState();
        expect(state.isDropdownOpen).toBe(false);
      }, 150);
    });
  });

  describe('Programmatic Operations', () => {
    test('should handle setFilters programmatically', () => {
      const filters: Filter[] = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'status', operator: '=', value: 'Active' },
      ];

      queryChips.setFilters(filters);

      const state = queryChips.getState();
      expect(state.filters).toEqual(filters);
    });

    test('should handle clearFilters programmatically', () => {
      // Set filters first
      const filters: Filter[] = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ];
      queryChips.setFilters(filters);

      // Clear filters
      queryChips.clearFilters();

      const state = queryChips.getState();
      expect(state.filters).toEqual([]);
      expect(state.advancedFilters?.conditions.length).toBe(0);
    });

    test('should handle destroy and recreate', () => {
      // Create and destroy
      queryChips.destroy();

      // Create new instance
      const newQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
      });
      newQueryChips.mount(container);

      expect(newQueryChips).toBeInstanceOf(QueryChips);
      newQueryChips.destroy();
    });
  });

  describe('Boolean Field Handling', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = container.querySelector('.querychips-input') as HTMLInputElement;
      input.focus();
    });

    test('should handle boolean field with dropdown values', () => {
      // Select boolean field
      input.value = 'Remote';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Should show dropdown with boolean values
      let state = queryChips.getState();
      expect(state.dropdownOptions).toContain('True');
      expect(state.dropdownOptions).toContain('False');

      // Select true from dropdown
      input.value = 'True';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(1);

      // Verify the filter value is properly parsed as boolean
      const filter = state.advancedFilters?.conditions[0] as Filter;
      expect(filter.value).toBe(true);
    });

    test('should handle translated boolean values', () => {
      // Update to Spanish translation
      queryChips.updateTranslation('es');

      // Select boolean field
      input.value = 'Remote';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      input.value = '=';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Should show dropdown with Spanish boolean values
      let state = queryChips.getState();
      expect(state.dropdownOptions).toContain('Verdadero');
      expect(state.dropdownOptions).toContain('Falso');

      // Select false from dropdown
      input.value = 'Falso';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      state = queryChips.getState();
      expect(state.advancedFilters?.conditions.length).toBe(1);

      // Verify the filter value is properly parsed as boolean
      const filter = state.advancedFilters?.conditions[0] as Filter;
      expect(filter.value).toBe(false);
    });
  });
});
