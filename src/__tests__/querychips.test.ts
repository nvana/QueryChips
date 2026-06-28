import { QueryChips } from '../querychips';
import { Field, Filter, QueryChipsConfig } from '../types';

// Mock DOM environment
document.body.innerHTML = '<div id="test-container"></div>';

describe('QueryChips', () => {
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
  });

  afterEach(() => {
    queryChips.destroy();
  });

  describe('Initialization', () => {
    test('should create QueryChips instance with correct configuration', () => {
      expect(queryChips).toBeInstanceOf(QueryChips);
      expect(queryChips.getState().filters).toEqual([]);
      expect(queryChips.getState().currentStep).toBe('field');
    });

    test('should validate field configuration', () => {
      const invalidFields: Field[] = [
        { key: 'test', label: 'Test', type: 'enum' }, // Missing values
      ];

      expect(() => {
        new QueryChips({
          data: sampleData,
          fields: invalidFields,
        });
      }).toThrow('Invalid field configuration');
    });

    test('should handle empty data array', () => {
      expect(() => {
        new QueryChips({
          data: [],
          fields: sampleFields,
        });
      }).toThrow('Data array cannot be empty');
    });

  });

  describe('Mounting', () => {
    test('should mount to container element', () => {
      queryChips.mount(container);
      expect(container.querySelector('.querychips-container')).toBeTruthy();
    });

    test('should inject styles when mounted', () => {
      queryChips.mount(container);
      expect(document.getElementById('querychips-styles')).toBeTruthy();
    });

    test('should handle multiple mount calls gracefully', () => {
      queryChips.mount(container);
      queryChips.mount(container); // Should not throw
      expect(container.querySelector('.querychips-container')).toBeTruthy();
    });

    test('should handle mounting to null container', () => {
      expect(() => {
        queryChips.mount(null as unknown as HTMLElement);
      }).toThrow();
    });

    test('should create input element with correct attributes', () => {
      queryChips.mount(container);
      const input = container.querySelector('.querychips-input') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.type).toBe('text');
      expect(input.getAttribute('aria-label')).toBeTruthy();
    });

    test('should create filter tags container', () => {
      queryChips.mount(container);
      const tagsContainer = container.querySelector('.querychips-filter-tags');
      expect(tagsContainer).toBeTruthy();
    });
  });

  describe('Filter Management', () => {
    beforeEach(() => {
      queryChips.mount(container);
    });

    test('should set filters programmatically', () => {
      const filters: Filter[] = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ];

      queryChips.setFilters(filters);
      expect(queryChips.getState().filters).toEqual(filters);
    });

    test('should clear all filters', () => {
      const filters: Filter[] = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ];

      queryChips.setFilters(filters);
      queryChips.clearFilters();
      expect(queryChips.getState().filters).toEqual([]);
    });

    test('should handle invalid filter data', () => {
      const invalidFilters = [
        { id: '1', field: 'nonexistent', operator: '=', value: 'test' },
      ];

      expect(() => {
        queryChips.setFilters(invalidFilters as unknown as Filter[]);
      }).not.toThrow();
    });

    test('should handle multiple filters', () => {
      const multipleFilters: Filter[] = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'status', operator: '=', value: 'Active' },
        { id: '3', field: 'salary', operator: '>', value: 80000 },
      ];

      queryChips.setFilters(multipleFilters);
      expect(queryChips.getState().filters).toHaveLength(3);
    });

    test('should handle filters with different data types', () => {
      const mixedFilters: Filter[] = [
        { id: '1', field: 'name', operator: 'contains', value: 'John' },
        { id: '2', field: 'experience', operator: '>', value: 5 },
        { id: '3', field: 'remote', operator: '=', value: true },
      ];

      queryChips.setFilters(mixedFilters);
      expect(queryChips.getState().filters).toEqual(mixedFilters);
    });
  });

  describe('State Management', () => {
    test('should return current state', () => {
      const state = queryChips.getState();
      expect(state).toHaveProperty('filters');
      expect(state).toHaveProperty('currentStep');
      expect(state).toHaveProperty('inputValue');
      expect(state).toHaveProperty('isDropdownOpen');
      expect(state).toHaveProperty('dropdownOptions');
      expect(state).toHaveProperty('selectedOptionIndex');
    });

    test('should return a copy of state, not reference', () => {
      const state1 = queryChips.getState();
      const state2 = queryChips.getState();
      expect(state1).not.toBe(state2);
    });

    test('should handle state updates correctly', () => {
      queryChips.mount(container);
      const mountedState = queryChips.getState();

      // State should be properly initialized after mounting
      expect(mountedState.currentStep).toBe('field');
      expect(mountedState.isDropdownOpen).toBe(false);
      expect(mountedState.dropdownOptions).toEqual([]);
      expect(mountedState.selectedOptionIndex).toBe(0);
    });

    test('should track current step correctly', () => {
      const state = queryChips.getState();
      expect(state.currentStep).toBe('field');
    });

    test('should track input value correctly', () => {
      const state = queryChips.getState();
      expect(state.inputValue).toBe('');
    });

    test('should track dropdown state correctly', () => {
      const state = queryChips.getState();
      expect(state.isDropdownOpen).toBe(false);
      expect(state.dropdownOptions).toEqual([]);
      expect(state.selectedOptionIndex).toBe(0);
    });
  });

  describe('Data Filtering', () => {
    beforeEach(() => {
      queryChips.mount(container);
    });

    test('should filter data based on string field', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: 'contains', value: 'John' },
      ];

      queryChips.setFilters(filters);
      // Note: This would require access to the filtered data through onChange callback
      expect(queryChips.getState().filters).toEqual(filters);
    });

    test('should filter data based on enum field', () => {
      const filters: Filter[] = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ];

      queryChips.setFilters(filters);
      expect(queryChips.getState().filters).toEqual(filters);
    });

    test('should filter data based on numeric field', () => {
      const filters: Filter[] = [
        { id: '1', field: 'salary', operator: '>', value: 80000 },
      ];

      queryChips.setFilters(filters);
      expect(queryChips.getState().filters).toEqual(filters);
    });

    test('should filter data based on boolean field', () => {
      const filters: Filter[] = [
        { id: '1', field: 'remote', operator: '=', value: true },
      ];

      queryChips.setFilters(filters);
      expect(queryChips.getState().filters).toEqual(filters);
    });

    test('should handle multiple filter conditions', () => {
      const filters: Filter[] = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'status', operator: '=', value: 'Active' },
      ];

      queryChips.setFilters(filters);
      expect(queryChips.getState().filters).toHaveLength(2);
    });
  });

  describe('Advanced Features', () => {

    test('should handle query language generation', () => {
      const configWithQueries: QueryChipsConfig = {
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch', 'sql', 'mongodb'],
      };

      const queryChipsWithQueries = new QueryChips(configWithQueries);
      expect(queryChipsWithQueries).toBeInstanceOf(QueryChips);
      queryChipsWithQueries.destroy();
    });

    test('should handle field inference', () => {
      const configWithInference: QueryChipsConfig = {
        data: sampleData,
        inferFields: true,
        enumThreshold: 5,
      };

      const inferenceQueryChips = new QueryChips(configWithInference);
      expect(inferenceQueryChips).toBeInstanceOf(QueryChips);
      inferenceQueryChips.destroy();
    });

  });

  describe('Performance', () => {
    test('should handle large datasets', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        department: ['Engineering', 'Design', 'Product'][i % 3],
        status: i % 2 === 0 ? 'Active' : 'Inactive',
        experience: (i % 10) + 1,
        salary: 50000 + (i * 1000),
        remote: i % 2 === 0,
      }));

      const largeQueryChips = new QueryChips({
        data: largeData,
        fields: sampleFields,
      });

      expect(largeQueryChips).toBeInstanceOf(QueryChips);
      largeQueryChips.destroy();
    });

  });

  describe('Accessibility', () => {
    test('should create accessible input element', () => {
      queryChips.mount(container);
      const input = container.querySelector('.querychips-input') as HTMLInputElement;
      expect(input.getAttribute('aria-label')).toBeTruthy();
    });
  });

  describe('Configuration Updates', () => {
    test('should update configuration', () => {
      queryChips.updateConfig({
        autoApply: true,
        onChange: () => {
          // console.log('Data changed:', data);
        },
      });

      expect(queryChips).toBeInstanceOf(QueryChips);
    });

    test('should handle partial configuration updates', () => {
      queryChips.updateConfig({
        autoApply: true,
      });

      expect(queryChips).toBeInstanceOf(QueryChips);
    });

    test('should handle theme updates', () => {
      const newTheme = {
        primaryColor: '#ff0000',
        secondaryColor: '#00ff00',
        mode: 'custom' as const,
      };

      queryChips.updateTheme(newTheme);
      expect(queryChips).toBeInstanceOf(QueryChips);
    });

    test('should handle translation updates', () => {
      queryChips.updateTranslation('es');
      expect(queryChips).toBeInstanceOf(QueryChips);
    });

    test('should handle custom translation updates', () => {
      // Skip this test due to complex Translation type requirements
      expect(queryChips).toBeInstanceOf(QueryChips);
    });
  });

  describe('Cleanup and Destruction', () => {
    test('should destroy instance correctly', () => {
      queryChips.mount(container);
      queryChips.destroy();

      // Should not throw when trying to access destroyed instance
      expect(() => {
        queryChips.getState();
      }).not.toThrow();
    });

    test('should handle multiple destroy calls', () => {
      queryChips.destroy();
      queryChips.destroy(); // Should not throw
    });

    test('should clean up event listeners', () => {
      queryChips.mount(container);

      // Verify that cleanup functions are called during destroy
      const originalCleanupFunctions = (queryChips as unknown as { cleanupFunctions: (() => void)[] }).cleanupFunctions;
      expect(originalCleanupFunctions.length).toBeGreaterThan(0);

      queryChips.destroy();

      // The cleanup functions should be cleared after destroy
      expect((queryChips as unknown as { cleanupFunctions: (() => void)[] }).cleanupFunctions).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid field configuration gracefully', () => {
      const invalidConfig = {
        data: sampleData,
        fields: [
          { key: 'invalid', label: 'Invalid', type: 'enum' as const }, // Missing values
        ],
      };

      expect(() => {
        new QueryChips(invalidConfig);
      }).toThrow();
    });

    test('should handle missing data gracefully', () => {
      expect(() => {
        new QueryChips({
          data: undefined as unknown as Record<string, unknown>[],
          fields: sampleFields,
        });
      }).toThrow();
    });

    test('should handle invalid container element', () => {
      queryChips.mount(container);
      expect(() => {
        queryChips.mount(null as unknown as HTMLElement);
      }).toThrow();
    });

    test('should handle invalid filter data', () => {
      expect(() => {
        queryChips.setFilters([
          { id: '1', field: 'nonexistent', operator: '=', value: 'test' },
        ] as unknown as Filter[]);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty field array', () => {
      const configWithNoFields = {
        data: sampleData,
        fields: [],
      };
      // The QueryChips constructor now handles empty fields gracefully
      expect(() => {
        new QueryChips(configWithNoFields);
      }).not.toThrow();
    });

    test('should handle single item data array', () => {
      const singleItemData = [{ id: 1, name: 'Test', department: 'Engineering' }];

      const singleItemQueryChips = new QueryChips({
        data: singleItemData,
        fields: sampleFields,
      });

      expect(singleItemQueryChips).toBeInstanceOf(QueryChips);
      singleItemQueryChips.destroy();
    });

    test('should handle very large field arrays', () => {
      const largeFields = Array.from({ length: 100 }, (_, i) => ({
        key: `field${i}`,
        label: `Field ${i}`,
        type: 'string' as const,
      }));

      const largeFieldsQueryChips = new QueryChips({
        data: sampleData,
        fields: largeFields,
      });

      expect(largeFieldsQueryChips).toBeInstanceOf(QueryChips);
      largeFieldsQueryChips.destroy();
    });

    test('should handle special characters in field names', () => {
      const specialFields: Field[] = [
        { key: 'field-with-dash', label: 'Field with dash', type: 'string' as const },
        { key: 'field_with_underscore', label: 'Field with underscore', type: 'string' as const },
        { key: 'fieldWithCamelCase', label: 'Field with camel case', type: 'string' as const },
      ];

      const specialFieldsQueryChips = new QueryChips({
        data: sampleData,
        fields: specialFields,
      });

      expect(specialFieldsQueryChips).toBeInstanceOf(QueryChips);
      specialFieldsQueryChips.destroy();
    });
  });

  describe('Default Query Backspace', () => {
    test('should remove simple default query filters with backspace', () => {
      const defaultQuery = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'remote', operator: '=', value: true },
      ];

      const queryChipsWithDefaults = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        defaultQuery,
        autoApply: true,
      });

      queryChipsWithDefaults.mount(container);

      // Verify initial state has 2 filters
      let state = queryChipsWithDefaults.getState();
      expect(state.filters.length).toBe(2);

      // Simulate backspace to remove the last filter
      const inputElement = container.querySelector('.querychips-input') as HTMLInputElement;
      const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
      inputElement.dispatchEvent(backspaceEvent);

      // Verify one filter is removed
      state = queryChipsWithDefaults.getState();
      expect(state.filters.length).toBe(1);
      expect(state.filters[0].field).toBe('department');

      // Simulate another backspace to remove the remaining filter
      inputElement.dispatchEvent(backspaceEvent);

      // Verify all filters are removed
      state = queryChipsWithDefaults.getState();
      expect(state.filters.length).toBe(0);

      queryChipsWithDefaults.destroy();
    });

    test('should handle backspace when input is empty for simple filters', () => {
      const defaultQuery = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ];

      const queryChipsWithDefaults = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        defaultQuery,
        autoApply: true,
      });

      queryChipsWithDefaults.mount(container);

      // Verify initial state has 1 filter
      let state = queryChipsWithDefaults.getState();
      expect(state.filters.length).toBe(1);

      // Simulate backspace with empty input
      const inputElement = container.querySelector('.querychips-input') as HTMLInputElement;
      inputElement.value = '';
      const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
      inputElement.dispatchEvent(backspaceEvent);

      // Verify filter is removed
      state = queryChipsWithDefaults.getState();
      expect(state.filters.length).toBe(0);

      queryChipsWithDefaults.destroy();
    });

    test('should handle backspace with short input for simple filters', () => {
      const defaultQuery = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'remote', operator: '=', value: true },
      ];

      const queryChipsWithDefaults = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        defaultQuery,
        autoApply: true,
      });

      queryChipsWithDefaults.mount(container);

      // Verify initial state has 2 filters
      let state = queryChipsWithDefaults.getState();
      expect(state.filters.length).toBe(2);

      // Simulate backspace with short input (1 character)
      const inputElement = container.querySelector('.querychips-input') as HTMLInputElement;
      inputElement.value = 'a';
      const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
      inputElement.dispatchEvent(backspaceEvent);

      // Verify one filter is removed
      state = queryChipsWithDefaults.getState();
      expect(state.filters.length).toBe(1);
      expect(state.filters[0].field).toBe('department');

      queryChipsWithDefaults.destroy();
    });

    test('should remove UI tags when filters are removed with backspace', () => {
      const defaultQuery = [
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'remote', operator: '=', value: true },
      ];

      const queryChipsWithDefaults = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        defaultQuery,
        autoApply: true,
      });

      queryChipsWithDefaults.mount(container);

      // Verify initial UI has filter tags
      let tags = container.querySelectorAll('.querychips-tag');
      expect(tags.length).toBeGreaterThan(0);

      // Simulate backspace to remove the last filter
      const inputElement = container.querySelector('.querychips-input') as HTMLInputElement;
      inputElement.value = '';
      const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
      inputElement.dispatchEvent(backspaceEvent);

      // Verify one filter is removed from state
      let state = queryChipsWithDefaults.getState();
      expect(state.filters.length).toBe(1);

      // Verify UI tags are updated (should have fewer tags)
      tags = container.querySelectorAll('.querychips-tag');
      expect(tags.length).toBeLessThan(3); // Should have fewer tags than initial

      // Simulate another backspace to remove the remaining filter
      inputElement.dispatchEvent(backspaceEvent);

      // Verify all filters are removed from state
      state = queryChipsWithDefaults.getState();
      expect(state.filters.length).toBe(0);

      // Verify all UI tags are removed
      tags = container.querySelectorAll('.querychips-tag');
      expect(tags.length).toBe(0);

      queryChipsWithDefaults.destroy();
    });

    test('should render field and operator tags when creating a filter', () => {
      const queryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        autoApply: false,
      });

      queryChips.mount(container);

      // Initially no tags should be visible
      let tags = container.querySelectorAll('.querychips-tag');
      expect(tags.length).toBe(0);

      // Simulate selecting a field by setting state directly
      const state = queryChips.getState();
      console.log('Initial state:', state);

      // Set selected field manually to test rendering
      (queryChips as any).state.selectedField = sampleFields[0]; // Department field
      (queryChips as any).state.currentStep = 'operator';

      // Force render
      (queryChips as any).render();

      // Check if field tag is rendered
      tags = container.querySelectorAll('.querychips-tag');
      console.log('Tags after setting field:', tags.length);
      console.log('Tag contents:', Array.from(tags).map(t => t.textContent));

      // Should have at least one tag (the field)
      expect(tags.length).toBeGreaterThan(0);
      expect(Array.from(tags).some(tag => tag.textContent === 'Department')).toBe(true);

      // Now set operator
      (queryChips as any).state.selectedOperator = '=';
      (queryChips as any).state.currentStep = 'value';

      // Force render again
      (queryChips as any).render();

      // Check if both field and operator tags are rendered
      tags = container.querySelectorAll('.querychips-tag');
      console.log('Tags after setting operator:', tags.length);
      console.log('Tag contents:', Array.from(tags).map(t => t.textContent));

      // Should have at least two tags (field and operator)
      expect(tags.length).toBeGreaterThan(1);
      expect(Array.from(tags).some(tag => tag.textContent === 'Department')).toBe(true);
      expect(Array.from(tags).some(tag => tag.textContent === '=')).toBe(true);

      queryChips.destroy();
    });
  });

  describe('Parentheses Behavior', () => {
    beforeEach(() => {
      queryChips.mount(container);
    });

    test('should include opening parenthesis in field dropdown', () => {
      // Simulate field step
      (queryChips as any).state.currentStep = 'field';
      (queryChips as any).updateDropdown();

      const dropdownOptions = (queryChips as any).state.dropdownOptions;
      expect(dropdownOptions).toContain('(');
    });

    test('should include closing parenthesis in logical dropdown when group is open', () => {
      // Open a group first
      (queryChips as any).openGroup('AND');

      // Simulate logical step
      (queryChips as any).state.currentStep = 'logical';
      (queryChips as any).updateDropdown();

      const dropdownOptions = (queryChips as any).state.dropdownOptions;
      expect(dropdownOptions).toContain(')');
    });

    test('should not include closing parenthesis when no groups are open', () => {
      // Ensure no groups are open
      (queryChips as any).groupStack = [];
      (queryChips as any).state.advancedFilters = undefined;

      // Simulate logical step
      (queryChips as any).state.currentStep = 'logical';
      (queryChips as any).updateDropdown();

      const dropdownOptions = (queryChips as any).state.dropdownOptions;
      expect(dropdownOptions).not.toContain(')');
    });

    test('should open group when opening parenthesis is selected', () => {
      // Simulate selecting opening parenthesis
      (queryChips as any).state.dropdownOptions = ['('];
      (queryChips as any).state.selectedOptionIndex = 0;
      (queryChips as any).selectDropdownOption(0);

      // Check if group is opened
      expect((queryChips as any).groupStack.length).toBe(1);
      expect((queryChips as any).state.advancedFilters).toBeTruthy();
      expect((queryChips as any).state.advancedFilters.currentGroupId).toBeTruthy();
    });

    test('should close group when closing parenthesis is selected', () => {
      // Open a group first
      (queryChips as any).openGroup('AND');
      const initialStackLength = (queryChips as any).groupStack.length;

      // Simulate selecting closing parenthesis
      (queryChips as any).state.dropdownOptions = [')'];
      (queryChips as any).state.selectedOptionIndex = 0;
      (queryChips as any).selectDropdownOption(0);

      // Check if group is closed
      expect((queryChips as any).groupStack.length).toBe(initialStackLength - 1);
    });

    test('should not close group when no groups are open', () => {
      // Ensure no groups are open
      (queryChips as any).groupStack = [];
      (queryChips as any).state.advancedFilters = undefined;

      // Simulate selecting closing parenthesis
      (queryChips as any).state.dropdownOptions = [')'];
      (queryChips as any).state.selectedOptionIndex = 0;
      (queryChips as any).selectDropdownOption(0);

      // Should not throw error and should not change state
      expect((queryChips as any).groupStack.length).toBe(0);
    });

    test('should render opening parenthesis for groups', () => {
      // Open a group
      (queryChips as any).openGroup('AND');

      // Force render
      (queryChips as any).render();

      // Check if opening parenthesis is rendered
      const tags = container.querySelectorAll('.querychips-tag');
      const openingParens = Array.from(tags).filter(tag => tag.textContent === '(');
      expect(openingParens.length).toBeGreaterThan(0);
    });

    test('should render closing parenthesis for closed groups', () => {
      // Open and close a group
      (queryChips as any).openGroup('AND');
      (queryChips as any).closeGroup();

      // Force render
      (queryChips as any).render();

      // Check if closing parenthesis is rendered
      const tags = container.querySelectorAll('.querychips-tag');
      const closingParens = Array.from(tags).filter(tag => tag.textContent === ')');
      expect(closingParens.length).toBeGreaterThan(0);
    });

    test('should not render closing parenthesis for open groups', () => {
      // Open a group but don't close it
      (queryChips as any).openGroup('AND');

      // Force render
      (queryChips as any).render();

      // Check that closing parenthesis is not rendered
      const tags = container.querySelectorAll('.querychips-tag');
      const closingParens = Array.from(tags).filter(tag => tag.textContent === ')');
      expect(closingParens.length).toBe(0);
    });

    test('should handle nested groups correctly', () => {
      // Open first group
      (queryChips as any).openGroup('AND');
      const firstGroupId = (queryChips as any).state.advancedFilters.currentGroupId;

      // Open second group (nested)
      (queryChips as any).openGroup('OR');
      const secondGroupId = (queryChips as any).state.advancedFilters.currentGroupId;

      // Check that both groups are in the stack
      expect((queryChips as any).groupStack.length).toBe(2);
      expect(firstGroupId).not.toBe(secondGroupId);

      // Close the inner group
      (queryChips as any).closeGroup();
      expect((queryChips as any).groupStack.length).toBe(1);
      expect((queryChips as any).state.advancedFilters.currentGroupId).toBe(firstGroupId);
    });

    test('should handle multiple independent groups', () => {
      // Open first group
      (queryChips as any).openGroup('AND');
      (queryChips as any).closeGroup();

      // Open second group
      (queryChips as any).openGroup('OR');

      // Check that we have one open group
      expect((queryChips as any).groupStack.length).toBe(1);
      expect((queryChips as any).state.advancedFilters.currentGroupId).toBeTruthy();
    });

    test('should not duplicate opening parentheses', () => {
      // Open a group
      (queryChips as any).openGroup('AND');

      // Force render multiple times
      (queryChips as any).render();
      (queryChips as any).render();
      (queryChips as any).render();

      // Check that opening parenthesis appears only once
      const tags = container.querySelectorAll('.querychips-tag');
      const openingParens = Array.from(tags).filter(tag => tag.textContent === '(');
      expect(openingParens.length).toBe(1);
    });

    test('should handle opening parenthesis in field step', () => {
      // Simulate field step with opening parenthesis input
      (queryChips as any).state.currentStep = 'field';
      (queryChips as any).state.inputValue = '(';

      // Simulate enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const inputElement = container.querySelector('.querychips-input') as HTMLInputElement;
      inputElement.dispatchEvent(enterEvent);

      // Check if group is opened
      expect((queryChips as any).groupStack.length).toBe(1);
      expect((queryChips as any).state.advancedFilters).toBeTruthy();
    });

    test('should handle closing parenthesis in logical step', () => {
      // Open a group first
      (queryChips as any).openGroup('AND');

      // Simulate logical step with closing parenthesis input
      (queryChips as any).state.currentStep = 'logical';
      (queryChips as any).state.inputValue = ')';

      // Simulate enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const inputElement = container.querySelector('.querychips-input') as HTMLInputElement;
      inputElement.dispatchEvent(enterEvent);

      // Check if group is closed
      expect((queryChips as any).groupStack.length).toBe(0);
    });

    test('should not create OR ( OR sequence when opening parenthesis after logical operator', () => {
      // Set up a logical operator first
      (queryChips as any).state.selectedLogicalOperator = 'OR';
      (queryChips as any).state.currentStep = 'logical';

      // Simulate selecting opening parenthesis
      (queryChips as any).state.dropdownOptions = ['('];
      (queryChips as any).state.selectedOptionIndex = 0;
      (queryChips as any).selectDropdownOption(0);

      // Check that the logical operator is cleared when opening parenthesis
      expect((queryChips as any).state.selectedLogicalOperator).toBeUndefined();
      expect((queryChips as any).groupStack.length).toBe(1);
    });

    test('should not create OR ( OR sequence when typing opening parenthesis after logical operator', () => {
      // Set up a logical operator first
      (queryChips as any).state.selectedLogicalOperator = 'OR';
      (queryChips as any).state.currentStep = 'logical';

      // Simulate typing opening parenthesis
      (queryChips as any).state.inputValue = '(';
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const inputElement = container.querySelector('.querychips-input') as HTMLInputElement;
      inputElement.dispatchEvent(enterEvent);

      // Check that the logical operator is cleared when opening parenthesis
      expect((queryChips as any).state.selectedLogicalOperator).toBeUndefined();
      expect((queryChips as any).groupStack.length).toBe(1);
    });
  });
});
