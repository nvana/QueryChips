import { QueryChips } from '../querychips';
import { Field, Filter } from '../types';

describe('Elasticsearch Example Integration', () => {
  let container: HTMLDivElement;
  let queryChips: QueryChips;

  const sampleData = [
    { id: 1, name: 'John Doe', age: 30, department: 'Engineering', salary: 75000, active: true },
    { id: 2, name: 'Jane Smith', age: 25, department: 'Marketing', salary: 65000, active: true },
    { id: 3, name: 'Bob Johnson', age: 35, department: 'Engineering', salary: 85000, active: false },
    { id: 4, name: 'Alice Brown', age: 28, department: 'Sales', salary: 70000, active: true },
    { id: 5, name: 'Charlie Wilson', age: 32, department: 'Engineering', salary: 80000, active: true },
  ];

  const fields: Field[] = [
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'age', label: 'Age', type: 'number' },
    { key: 'department', label: 'Department', type: 'enum', values: ['Engineering', 'Marketing', 'Sales', 'HR'] },
    { key: 'salary', label: 'Salary', type: 'number' },
    { key: 'active', label: 'Active', type: 'boolean' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: jest.fn(),
    });
  });

  afterEach(() => {
    if (queryChips) {
      queryChips.destroy();
    }
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('should generate correct Elasticsearch query for single filter', () => {
    const mockOnQueryChange = jest.fn();
    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: mockOnQueryChange,
    });

    // Simulate adding a filter
    const filter: Filter = {
      id: '1',
      field: 'department',
      operator: '=',
      value: 'Engineering',
    };

    queryChips.setFilters([filter]);

    expect(mockOnQueryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        elasticsearch: { term: { department: 'Engineering' } },
      }),
      expect.any(Object),
    );
  });

  it('should generate correct Elasticsearch query for multiple filters with AND logic', () => {
    const mockOnQueryChange = jest.fn();
    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: mockOnQueryChange,
    });

    // Simulate adding multiple filters
    const filter1: Filter = {
      id: '1',
      field: 'department',
      operator: '=',
      value: 'Engineering',
    };

    const filter2: Filter = {
      id: '2',
      field: 'age',
      operator: '>',
      value: 30,
    };

    queryChips.setFilters([filter1, filter2]);

    expect(mockOnQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        elasticsearch: {
          bool: {
            must: [
              { term: { department: 'Engineering' } },
              { range: { age: { gt: 30 } } },
            ],
          },
        },
      }),
      expect.any(Object),
    );
  });

  it('should generate correct Elasticsearch query for NOT operator', () => {
    const mockOnQueryChange = jest.fn();
    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: mockOnQueryChange,
    });

    // Simulate adding a NOT filter
    const filter: Filter = {
      id: '1',
      field: 'active',
      operator: '!=',
      value: false,
    };

    queryChips.setFilters([filter]);

    expect(mockOnQueryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        elasticsearch: {
          bool: {
            must_not: [
              { term: { active: false } },
            ],
          },
        },
      }),
      expect.any(Object),
    );
  });

  it('should generate correct Elasticsearch query for string contains operator', () => {
    const mockOnQueryChange = jest.fn();
    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: mockOnQueryChange,
    });

    // Simulate adding a contains filter
    const filter: Filter = {
      id: '1',
      field: 'name',
      operator: 'contains',
      value: 'John',
    };

    queryChips.setFilters([filter]);

    expect(mockOnQueryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        elasticsearch: { match: { name: 'John' } },
      }),
      expect.any(Object),
    );
  });

  it('should generate correct Elasticsearch query for range operators', () => {
    const mockOnQueryChange = jest.fn();
    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: mockOnQueryChange,
    });

    // Simulate adding a range filter
    const filter: Filter = {
      id: '1',
      field: 'salary',
      operator: '>=',
      value: 70000,
    };

    queryChips.setFilters([filter]);

    expect(mockOnQueryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        elasticsearch: { range: { salary: { gte: 70000 } } },
      }),
      expect.any(Object),
    );
  });

  it('should generate match_all query when no filters are applied', () => {
    const mockOnQueryChange = jest.fn();
    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: mockOnQueryChange,
    });

    // The onQueryChange should be called with match_all when no filters are applied
    // We need to manually call applyFilters since autoApply might be false
    queryChips['applyFilters']();

    expect(mockOnQueryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        elasticsearch: { match_all: {} },
      }),
      expect.any(Object),
    );
  });

  it('should handle complex mixed queries correctly', () => {
    const mockOnQueryChange = jest.fn();
    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: mockOnQueryChange,
    });

    // Simulate adding complex filters
    const filter1: Filter = {
      id: '1',
      field: 'department',
      operator: '=',
      value: 'Engineering',
    };

    const filter2: Filter = {
      id: '2',
      field: 'salary',
      operator: '>',
      value: 70000,
    };

    const filter3: Filter = {
      id: '3',
      field: 'active',
      operator: '!=',
      value: false,
    };

    queryChips.setFilters([filter1, filter2, filter3]);

    expect(mockOnQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        elasticsearch: {
          bool: {
            must: [
              { term: { department: 'Engineering' } },
              { range: { salary: { gt: 70000 } } },
            ],
            must_not: [
              { term: { active: false } },
            ],
          },
        },
      }),
      expect.any(Object),
    );
  });

  it('should handle boolean filters correctly', () => {
    const mockOnQueryChange = jest.fn();
    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: mockOnQueryChange,
    });

    // Simulate adding a boolean filter
    const filter: Filter = {
      id: '1',
      field: 'active',
      operator: '=',
      value: true,
    };

    queryChips.setFilters([filter]);

    expect(mockOnQueryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        elasticsearch: { term: { active: true } },
      }),
      expect.any(Object),
    );
  });

  it('should handle enum filters correctly', () => {
    const mockOnQueryChange = jest.fn();
    queryChips = new QueryChips({
      container,
      fields,
      data: sampleData,
      onQueryChange: mockOnQueryChange,
    });

    // Simulate adding an enum filter
    const filter: Filter = {
      id: '1',
      field: 'department',
      operator: '=',
      value: 'Marketing',
    };

    queryChips.setFilters([filter]);

    expect(mockOnQueryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        elasticsearch: { term: { department: 'Marketing' } },
      }),
      expect.any(Object),
    );
  });
});
