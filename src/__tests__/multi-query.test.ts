import { QueryChips } from '../querychips';
import { Field } from '../types';

// Mock DOM environment
document.body.innerHTML = '<div id="test-container"></div>';

describe('QueryChips Multi-Query Generation', () => {
  let container: HTMLElement;
  let queryChips: QueryChips;

  const sampleData = [
    { id: 1, name: 'John Doe', department: 'Engineering', status: 'Active', experience: 5, salary: 85000, location: 'San Francisco', remote: true, skills: ['JavaScript', 'React', 'Node.js'] },
    { id: 2, name: 'Jane Smith', department: 'Design', status: 'Active', experience: 3, salary: 75000, location: 'New York', remote: false, skills: ['Figma', 'Sketch', 'Adobe Creative Suite'] },
    { id: 3, name: 'Bob Johnson', department: 'Engineering', status: 'Inactive', experience: 7, salary: 95000, location: 'Seattle', remote: true, skills: ['Python', 'Django', 'PostgreSQL'] },
    { id: 4, name: 'Alice Brown', department: 'Product', status: 'Active', experience: 4, salary: 80000, location: 'Austin', remote: true, skills: ['Product Management', 'User Research', 'Analytics'] },
    { id: 5, name: 'Charlie Wilson', department: 'Marketing', status: 'Active', experience: 2, salary: 65000, location: 'Chicago', remote: false, skills: ['Digital Marketing', 'SEO', 'Content Creation'] },
  ];

  const sampleFields: Field[] = [
    { key: 'department', label: 'Department', type: 'enum', values: ['Engineering', 'Design', 'Product', 'Marketing'] },
    { key: 'status', label: 'Status', type: 'enum', values: ['Active', 'Inactive'] },
    { key: 'experience', label: 'Experience', type: 'number' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'salary', label: 'Salary', type: 'number' },
    { key: 'remote', label: 'Remote', type: 'boolean' },
    { key: 'location', label: 'Location', type: 'string' },
    { key: 'skills', label: 'Skills', type: 'string' },
  ];

  beforeEach(() => {
    container = document.getElementById('test-container')!;
    container.innerHTML = '';

    queryChips = new QueryChips({
      data: sampleData,
      fields: sampleFields,
      autoApply: false,
      queryLanguages: ['elasticsearch', 'sql', 'mongodb', 'graphql'],
    });
  });

  afterEach(() => {
    queryChips.destroy();
  });

  describe('Elasticsearch Query Generation', () => {
    test('should generate simple term query', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elasticsearch: expect.objectContaining({
            term: expect.objectContaining({
              department: 'Engineering',
            }),
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should generate range query for numeric fields', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'salary', operator: '>', value: 80000 },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elasticsearch: expect.objectContaining({
            range: expect.objectContaining({
              salary: expect.objectContaining({
                gt: 80000,
              }),
            }),
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should generate bool query for multiple filters', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'status', operator: '=', value: 'Active' },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elasticsearch: expect.objectContaining({
            bool: expect.objectContaining({
              must: expect.arrayContaining([
                expect.objectContaining({
                  term: expect.objectContaining({
                    department: 'Engineering',
                  }),
                }),
                expect.objectContaining({
                  term: expect.objectContaining({
                    status: 'Active',
                  }),
                }),
              ]),
            }),
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should generate match query for string fields', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'name', operator: 'contains', value: 'John' },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elasticsearch: expect.objectContaining({
            match: expect.objectContaining({
              name: 'John',
            }),
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });
  });

  describe('SQL Query Generation', () => {
    test('should generate simple WHERE clause', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['sql'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          sql: expect.objectContaining({
            query: expect.stringContaining('WHERE department = ?'),
            parameters: ['Engineering'],
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should generate complex WHERE clause with multiple conditions', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['sql'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'salary', operator: '>', value: 80000 },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          sql: expect.objectContaining({
            query: expect.stringContaining('WHERE department = ? AND salary > ?'),
            parameters: ['Engineering', 80000],
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should handle LIKE operator for string fields', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['sql'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'name', operator: 'contains', value: 'John' },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          sql: expect.objectContaining({
            query: expect.stringContaining('WHERE name LIKE ?'),
            parameters: ['%John%'],
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });
  });

  describe('MongoDB Query Generation', () => {
    test('should generate simple filter object', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['mongodb'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          mongodb: expect.objectContaining({
            filter: expect.objectContaining({
              department: 'Engineering',
            }),
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should generate complex filter with multiple conditions', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['mongodb'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'remote', operator: '=', value: true },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          mongodb: expect.objectContaining({
            filter: expect.objectContaining({
              department: 'Engineering',
              remote: true,
            }),
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should handle $gt operator for numeric fields', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['mongodb'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'salary', operator: '>', value: 80000 },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          mongodb: expect.objectContaining({
            filter: expect.objectContaining({
              salary: expect.objectContaining({
                $gt: 80000,
              }),
            }),
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });
  });

  describe('GraphQL Query Generation', () => {
    test('should generate simple GraphQL query', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['graphql'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          graphql: expect.objectContaining({
            query: expect.stringContaining('query'),
            variables: expect.objectContaining({
              department: 'Engineering',
            }),
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should generate GraphQL query with multiple variables', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['graphql'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        { id: '2', field: 'status', operator: '=', value: 'Active' },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          graphql: expect.objectContaining({
            query: expect.stringContaining('query'),
            variables: expect.objectContaining({
              department: 'Engineering',
              status: 'Active',
            }),
          }),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });
  });

  describe('Multiple Query Languages', () => {
    test('should generate queries for all specified languages', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch', 'sql', 'mongodb', 'graphql'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: 'Engineering' },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elasticsearch: expect.any(Object),
          sql: expect.any(Object),
          mongodb: expect.any(Object),
          graphql: expect.any(Object),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should handle different operators across languages', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch', 'sql', 'mongodb'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'name', operator: 'contains', value: 'John' },
        { id: '2', field: 'salary', operator: '>', value: 80000 },
        { id: '3', field: 'remote', operator: '=', value: true },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elasticsearch: expect.any(Object),
          sql: expect.any(Object),
          mongodb: expect.any(Object),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty filters', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch', 'sql', 'mongodb', 'graphql'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([]);

      expect(mockOnQueryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elasticsearch: expect.any(Object),
          sql: expect.any(Object),
          mongodb: expect.any(Object),
          graphql: expect.any(Object),
        }),
        expect.any(Object),
      );

      testQueryChips.destroy();
    });

    test('should handle invalid field references', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'nonexistent', operator: '=', value: 'test' },
      ]);

      // Should still generate queries even with invalid fields
      expect(mockOnQueryChange).toHaveBeenCalled();

      testQueryChips.destroy();
    });

    test('should handle null/undefined values', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch'],
        onQueryChange: mockOnQueryChange,
      });

      testQueryChips.setFilters([
        { id: '1', field: 'department', operator: '=', value: null as unknown as string },
      ]);

      expect(mockOnQueryChange).toHaveBeenCalled();

      testQueryChips.destroy();
    });
  });

  describe('Performance', () => {
    test('should handle large number of filters efficiently', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch', 'sql', 'mongodb', 'graphql'],
        onQueryChange: mockOnQueryChange,
      });

      const manyFilters = Array.from({ length: 20 }, (_, i) => ({
        id: `filter-${i}`,
        field: 'department',
        operator: '=',
        value: 'Engineering',
      }));

      testQueryChips.setFilters(manyFilters);

      expect(mockOnQueryChange).toHaveBeenCalled();
      expect(mockOnQueryChange.mock.calls[0][0]).toHaveProperty('elasticsearch');
      expect(mockOnQueryChange.mock.calls[0][0]).toHaveProperty('sql');
      expect(mockOnQueryChange.mock.calls[0][0]).toHaveProperty('mongodb');
      expect(mockOnQueryChange.mock.calls[0][0]).toHaveProperty('graphql');

      testQueryChips.destroy();
    });

    test('should handle rapid filter changes', () => {
      const mockOnQueryChange = jest.fn();
      const testQueryChips = new QueryChips({
        data: sampleData,
        fields: sampleFields,
        queryLanguages: ['elasticsearch'],
        onQueryChange: mockOnQueryChange,
      });

      // Rapid filter changes
      for (let i = 0; i < 10; i++) {
        testQueryChips.setFilters([
          { id: '1', field: 'department', operator: '=', value: 'Engineering' },
        ]);
        testQueryChips.clearFilters();
      }

      expect(mockOnQueryChange).toHaveBeenCalled();

      testQueryChips.destroy();
    });
  });
});
