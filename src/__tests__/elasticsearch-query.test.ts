import { filtersToElasticsearchQuery, advancedConditionsToElasticsearchQuery } from '../utils';
import { Filter, Field, ConditionItem } from '../types';

describe('Elasticsearch Query Generation', () => {
  const sampleFields: Field[] = [
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'age', label: 'Age', type: 'number' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'category', label: 'Category', type: 'enum', values: ['A', 'B', 'C'] },
    { key: 'created', label: 'Created', type: 'date' },
    { key: 'score', label: 'Score', type: 'number' },
  ];

  describe('filtersToElasticsearchQuery', () => {
    it('should return match_all for empty filters', () => {
      const result = filtersToElasticsearchQuery([], sampleFields);
      expect(result).toEqual({ match_all: {} });
    });

    it('should handle single string filter with equals operator', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: '=', value: 'John' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ term: { name: 'John' } });
    });

    it('should handle single number filter with equals operator', () => {
      const filters: Filter[] = [
        { id: '1', field: 'age', operator: '=', value: 25 },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ term: { age: 25 } });
    });

    it('should handle single boolean filter', () => {
      const filters: Filter[] = [
        { id: '1', field: 'active', operator: '=', value: true },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ term: { active: true } });
    });

    it('should handle single enum filter', () => {
      const filters: Filter[] = [
        { id: '1', field: 'category', operator: '=', value: 'A' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ term: { category: 'A' } });
    });

    it('should handle string contains operator', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: 'contains', value: 'John' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ match: { name: 'John' } });
    });

    it('should handle string startsWith operator', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: 'startsWith', value: 'Jo' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ prefix: { name: 'Jo' } });
    });

    it('should handle string endsWith operator', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: 'endsWith', value: 'hn' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ wildcard: { name: '*hn' } });
    });

    it('should handle number range operators', () => {
      const filters: Filter[] = [
        { id: '1', field: 'age', operator: '>', value: 18 },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ range: { age: { gt: 18 } } });
    });

    it('should handle multiple filters with AND logic', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: '=', value: 'John' },
        { id: '2', field: 'age', operator: '>', value: 18 },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({
        bool: {
          must: [
            { term: { name: 'John' } },
            { range: { age: { gt: 18 } } },
          ],
        },
      });
    });

    it('should handle multiple filters with NOT operator', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: '=', value: 'John' },
        { id: '2', field: 'active', operator: '!=', value: false },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({
        bool: {
          must: [
            { term: { name: 'John' } },
          ],
          must_not: [
            { term: { active: false } },
          ],
        },
      });
    });

    it('should handle unknown field gracefully', () => {
      const filters: Filter[] = [
        { id: '1', field: 'unknown', operator: '=', value: 'test' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ match_all: {} });
    });

    it('should handle mixed valid and invalid fields', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: '=', value: 'John' },
        { id: '2', field: 'unknown', operator: '=', value: 'test' },
        { id: '3', field: 'age', operator: '>', value: 18 },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({
        bool: {
          must: [
            { term: { name: 'John' } },
            { range: { age: { gt: 18 } } },
          ],
        },
      });
    });

    it('should handle all NOT operators', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: '!=', value: 'John' },
        { id: '2', field: 'age', operator: '!=', value: 25 },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({
        bool: {
          must_not: [
            { term: { name: 'John' } },
            { term: { age: 25 } },
          ],
        },
      });
    });

    it('should return match_all when all filters are invalid', () => {
      const filters: Filter[] = [
        { id: '1', field: 'unknown1', operator: '=', value: 'test1' },
        { id: '2', field: 'unknown2', operator: '=', value: 'test2' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ match_all: {} });
    });
  });

  describe('advancedConditionsToElasticsearchQuery', () => {
    it('should return match_all for empty conditions', () => {
      const result = advancedConditionsToElasticsearchQuery([], sampleFields);
      expect(result).toEqual({ match_all: {} });
    });

    it('should handle single condition', () => {
      const conditions: ConditionItem[] = [
        { id: '1', field: 'name', operator: '=', value: 'John' },
      ];
      const result = advancedConditionsToElasticsearchQuery(conditions, sampleFields);
      expect(result).toEqual({ term: { name: 'John' } });
    });

    it('should handle condition group with AND operator', () => {
      const conditions: ConditionItem[] = [
        {
          id: 'group1',
          type: 'group',
          operator: 'AND',
          conditions: [
            { id: '1', field: 'name', operator: '=', value: 'John' },
            { id: '2', field: 'age', operator: '>', value: 18 },
          ],
        },
      ];
      const result = advancedConditionsToElasticsearchQuery(conditions, sampleFields);
      expect(result).toEqual({
        bool: {
          must: [
            { term: { name: 'John' } },
            { range: { age: { gt: 18 } } },
          ],
        },
      });
    });

    it('should handle condition group with OR operator', () => {
      const conditions: ConditionItem[] = [
        {
          id: 'group1',
          type: 'group',
          operator: 'OR',
          conditions: [
            { id: '1', field: 'name', operator: '=', value: 'John' },
            { id: '2', field: 'name', operator: '=', value: 'Jane' },
          ],
        },
      ];
      const result = advancedConditionsToElasticsearchQuery(conditions, sampleFields);
      expect(result).toEqual({
        bool: {
          should: [
            { term: { name: 'John' } },
            { term: { name: 'Jane' } },
          ],
          minimum_should_match: 1,
        },
      });
    });

    it('should handle nested condition groups', () => {
      const conditions: ConditionItem[] = [
        {
          id: 'group1',
          type: 'group',
          operator: 'AND',
          conditions: [
            { id: '1', field: 'name', operator: '=', value: 'John' },
            {
              id: 'group2',
              type: 'group',
              operator: 'OR',
              conditions: [
                { id: '2', field: 'age', operator: '>', value: 18 },
                { id: '3', field: 'active', operator: '=', value: true },
              ],
            },
          ],
        },
      ];
      const result = advancedConditionsToElasticsearchQuery(conditions, sampleFields);
      expect(result).toEqual({
        bool: {
          must: [
            { term: { name: 'John' } },
            {
              bool: {
                should: [
                  { range: { age: { gt: 18 } } },
                  { term: { active: true } },
                ],
                minimum_should_match: 1,
              },
            },
          ],
        },
      });
    });

    it('should handle null/undefined conditions gracefully', () => {
      const conditions: ConditionItem[] = [
        null as any,
        undefined as any,
        { id: '1', field: 'name', operator: '=', value: 'John' },
      ];
      const result = advancedConditionsToElasticsearchQuery(conditions, sampleFields);
      expect(result).toEqual({ term: { name: 'John' } });
    });

    it('should handle empty condition group', () => {
      const conditions: ConditionItem[] = [
        {
          id: 'group1',
          type: 'group',
          operator: 'AND',
          conditions: [],
        },
      ];
      const result = advancedConditionsToElasticsearchQuery(conditions, sampleFields);
      expect(result).toEqual({ match_all: {} });
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle empty fields array', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: '=', value: 'John' },
      ];
      const result = filtersToElasticsearchQuery(filters, []);
      expect(result).toEqual({ match_all: {} });
    });

    it('should handle filters with null/undefined values', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: '=', value: null as any },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ term: { name: null } });
    });

    it('should handle unknown operators gracefully', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: 'unknown' as any, value: 'John' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ match: { name: 'John' } });
    });

    it('should handle date filters', () => {
      const filters: Filter[] = [
        { id: '1', field: 'created', operator: '>', value: '2023-01-01' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ range: { created: { gt: '2023-01-01' } } });
    });

    it('should handle wildcard operator', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: 'wildcard', value: 'Jo*n' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ wildcard: { name: 'Jo*n' } });
    });

    it('should handle regexp operator', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: 'regexp', value: 'Jo.*n' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ regexp: { name: 'Jo.*n' } });
    });

    it('should handle fuzzy operator', () => {
      const filters: Filter[] = [
        { id: '1', field: 'name', operator: 'fuzzy', value: 'John' },
      ];
      const result = filtersToElasticsearchQuery(filters, sampleFields);
      expect(result).toEqual({ fuzzy: { name: { value: 'John' } } });
    });
  });
});
