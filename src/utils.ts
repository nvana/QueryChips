import {
  Filter,
  Field,
  FieldType,
  LogicalOperator,
  ConditionItem,
  ConditionGroup,
  AdvancedFilterState,
  ElasticsearchQuery,
  SQLQuery,
  MongoDBQuery,
  GraphQLQuery,
  OPERATORS,
} from './types';

/**
 * Generates a unique identifier for filters and conditions
 * @returns A unique string identifier
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Validates a field configuration
 * @param field - The field to validate
 * @returns True if the field is valid, false otherwise
 */
export function validateField(field: Field): boolean {
  if (!field.key || !field.label || !field.type) {
    return false;
  }

  if (field.type === 'enum' && (!field.values || field.values.length === 0)) {
    return false;
  }

  return true;
}

/**
 * Filters data based on the provided filters and fields
 * @template TData - The type of data being filtered
 * @param data - Array of data to filter
 * @param filters - Array of filters to apply
 * @param fields - Field definitions for filtering
 * @param advancedFilters - Advanced filter state for complex queries
 * @returns Filtered data array
 */
export function filterData<TData = Record<string, unknown>>(
  data: TData[],
  filters: Filter[],
  fields: Field[],
  advancedFilters?: AdvancedFilterState,
): TData[] {
  if (filters.length === 0 && (!advancedFilters || advancedFilters.conditions.length === 0)) {
    return data;
  }

  // Use advanced filtering if available
  if (advancedFilters && advancedFilters.conditions.length > 0) {
    return data.filter(item => evaluateAdvancedConditions(item, advancedFilters.conditions, fields, advancedFilters.logicalOperators));
  }

  // Fallback to simple filtering
  return data.filter(item => {
    return filters.every(filter => {
      const field = fields.find(f => f.key === filter.field);
      if (!field) return true;

      const itemValue = (item as Record<string, unknown>)[filter.field];
      return evaluateFilter(itemValue, filter, field);
    });
  });
}

/**
 * Evaluates advanced conditions with logical operators and groups
 * @template TData - The type of data item being evaluated
 * @param item - The data item to evaluate against
 * @param conditions - Array of conditions to evaluate
 * @param fields - Field definitions for filtering
 * @param logicalOperators - Logical operators between conditions
 * @returns True if the item matches all conditions, false otherwise
 */
export function evaluateAdvancedConditions<TData = Record<string, unknown>>(
  item: TData,
  conditions: ConditionItem[],
  fields: Field[],
  logicalOperators: LogicalOperator[] = [],
): boolean {
  if (conditions.length === 0) return true;

  // If only one condition, evaluate it directly
  if (conditions.length === 1) {
    return evaluateConditionItem(item, conditions[0], fields);
  }

  // For multiple conditions, use the logical operators
  let result = evaluateConditionItem(item, conditions[0], fields);

  for (let i = 1; i < conditions.length; i++) {
    const operator = logicalOperators[i - 1] ?? 'AND'; // Default to AND if no operator specified
    const conditionResult = evaluateConditionItem(item, conditions[i], fields);

    if (operator === 'AND') {
      result = result && conditionResult;
    } else if (operator === 'OR') {
      result = result || conditionResult;
    }
  }

  return result;
}

/**
 * Evaluates a single condition item (filter or group)
 * @template TData - The type of data item being evaluated
 * @param item - The data item to evaluate against
 * @param condition - The condition to evaluate
 * @param fields - Field definitions for filtering
 * @returns True if the item matches the condition, false otherwise
 */
export function evaluateConditionItem<TData = Record<string, unknown>>(
  item: TData,
  condition: ConditionItem,
  fields: Field[],
): boolean {
  if (isConditionGroup(condition)) {
    return evaluateConditionGroup(item, condition, fields);
  } else {
    return evaluateFilter((item as Record<string, unknown>)[condition.field], condition, fields.find(f => f.key === condition.field)!);
  }
}

/**
 * Type guard to check if a condition item is a group
 * @param condition - The condition item to check
 * @returns True if the condition is a group, false otherwise
 */
export function isConditionGroup(condition: ConditionItem): condition is ConditionGroup {
  if (!condition) return false;
  return 'type' in condition && condition.type === 'group';
}

/**
 * Evaluates a condition group
 * @template TData - The type of data item being evaluated
 * @param item - The data item to evaluate against
 * @param group - The condition group to evaluate
 * @param fields - Field definitions for filtering
 * @returns True if the item matches the group conditions, false otherwise
 */
export function evaluateConditionGroup<TData = Record<string, unknown>>(
  item: TData,
  group: ConditionGroup,
  fields: Field[],
): boolean {
  if (group.conditions.length === 0) return true;

  // --- FIX: Support mixed AND/OR operators within groups ---
  if (group.logicalOperators && group.logicalOperators.length > 0) {
    // Use the logical operators between conditions
    let result = evaluateConditionItem(item, group.conditions[0], fields);

    for (let i = 1; i < group.conditions.length; i++) {
      const operator = group.logicalOperators[i - 1] ?? group.operator; // Fallback to group operator
      const conditionResult = evaluateConditionItem(item, group.conditions[i], fields);

      if (operator === 'AND') {
        result = result && conditionResult;
      } else if (operator === 'OR') {
        result = result || conditionResult;
      }
    }

    return result;
  } else {
    // Use the group's default operator for all conditions
    if (group.operator === 'AND') {
      return group.conditions.every(condition => evaluateConditionItem(item, condition, fields));
    } else if (group.operator === 'OR') {
      return group.conditions.some(condition => evaluateConditionItem(item, condition, fields));
    }
  }

  return true;
}

/**
 * Evaluates a single filter against a field value
 * @param itemValue - The value to evaluate against
 * @param filter - The filter to apply
 * @param field - The field definition
 * @returns True if the value matches the filter, false otherwise
 */
export function evaluateFilter(itemValue: unknown, filter: Filter, field: Field): boolean {
  const { operator, value } = filter;

  // Handle null/undefined values
  if (itemValue == null) {
    return operator === '!=' && value !== null;
  }

  switch (field.type) {
  case 'string':
    return evaluateStringFilter(itemValue, operator, value as string);
  case 'number':
    return evaluateNumberFilter(itemValue, operator, value as number);
  case 'boolean':
    return evaluateBooleanFilter(itemValue, operator, value as boolean);
  case 'enum':
    return evaluateStringFilter(itemValue, operator, value as string);
  case 'date':
    return evaluateDateFilter(itemValue, operator, value as string);
  default:
    return true;
  }
}

function evaluateStringFilter(itemValue: unknown, operator: string, value: string): boolean {
  const strValue = String(itemValue).toLowerCase();
  const filterValue = String(value || '').toLowerCase();

  switch (operator) {
  case '=':
    return strValue === filterValue;
  case '!=':
    return strValue !== filterValue;
  case 'contains':
    return strValue.includes(filterValue);
  case 'startsWith':
    return strValue.startsWith(filterValue);
  case 'endsWith':
    return strValue.endsWith(filterValue);
  case 'wildcard':
    return wildcardMatch(strValue, filterValue);
  case 'prefix':
    return strValue.startsWith(filterValue);
  case 'regexp':
    try {
      const regex = new RegExp(filterValue, 'i');
      return regex.test(strValue);
    } catch {
      return false;
    }
  case 'fuzzy':
    return fuzzyMatch(strValue, filterValue);
  default:
    return true;
  }
}

function evaluateNumberFilter(itemValue: unknown, operator: string, value: number): boolean {
  const numValue = Number(itemValue);
  if (isNaN(numValue)) return false;

  switch (operator) {
  case '=':
    return numValue === value;
  case '!=':
    return numValue !== value;
  case '>':
    return numValue > value;
  case '<':
    return numValue < value;
  case '>=':
    return numValue >= value;
  case '<=':
    return numValue <= value;
  default:
    return true;
  }
}

function evaluateBooleanFilter(itemValue: unknown, operator: string, value: boolean): boolean {
  const boolValue = Boolean(itemValue);

  switch (operator) {
  case '=':
    return boolValue === value;
  case '!=':
    return boolValue !== value;
  default:
    return true;
  }
}

function evaluateDateFilter(itemValue: unknown, operator: string, value: string): boolean {
  const itemDate = new Date(String(itemValue));
  const filterDate = new Date(value);

  if (isNaN(itemDate.getTime()) || isNaN(filterDate.getTime())) {
    return false;
  }

  switch (operator) {
  case '=':
    return itemDate.getTime() === filterDate.getTime();
  case '!=':
    return itemDate.getTime() !== filterDate.getTime();
  case '>':
    return itemDate.getTime() > filterDate.getTime();
  case '<':
    return itemDate.getTime() < filterDate.getTime();
  case '>=':
    return itemDate.getTime() >= filterDate.getTime();
  case '<=':
    return itemDate.getTime() <= filterDate.getTime();
  default:
    return true;
  }
}

// Utility functions for string matching
function wildcardMatch(text: string, pattern: string): boolean {
  const regexPattern = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\?/g, '.')
    .replace(/\*/g, '.*');

  try {
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(text);
  } catch {
    return false;
  }
}

function fuzzyMatch(text: string, pattern: string): boolean {
  const textLower = text.toLowerCase();
  const patternLower = pattern.toLowerCase();

  let patternIndex = 0;
  for (let i = 0; i < textLower.length && patternIndex < patternLower.length; i++) {
    if (textLower[i] === patternLower[patternIndex]) {
      patternIndex++;
    }
  }

  return patternIndex === patternLower.length;
}

/**
 * Converts QueryChips filters to Elasticsearch query
 * @param filters - Array of filters to convert
 * @param fields - Field definitions for filtering
 * @param advancedFilters - Advanced filter state for complex queries
 * @returns Elasticsearch query object
 */
export function filtersToElasticsearchQuery(filters: Filter[], fields: Field[], advancedFilters?: AdvancedFilterState): ElasticsearchQuery {
  if (advancedFilters && advancedFilters.conditions.length > 0) {
    return advancedConditionsToElasticsearchQuery(advancedFilters.conditions, fields);
  }

  if (filters.length === 0) {
    return { match_all: {} };
  }

  // For single filter, handle NOT operator specially
  if (filters.length === 1) {
    const filter = filters[0];
    const field = fields.find(f => f.key === filter.field);
    if (!field) return { match_all: {} };

    const query = convertFilterToElasticsearchQuery(filter, field);
    if (!query) return { match_all: {} };

    // For NOT operator, wrap in bool query with must_not
    if (filter.operator === '!=') {
      return { bool: { must_not: [query] } };
    }

    return query;
  }

  // For multiple filters, use bool query
  const must: ElasticsearchQuery[] = [];
  const must_not: ElasticsearchQuery[] = [];

  filters.forEach(filter => {
    const field = fields.find(f => f.key === filter.field);
    if (!field) return;

    const query = convertFilterToElasticsearchQuery(filter, field);
    if (query) {
      if (filter.operator === '!=') {
        must_not.push(query);
      } else {
        must.push(query);
      }
    }
  });

  const boolQuery: Record<string, unknown> = {};
  if (must.length > 0) {
    boolQuery.must = must;
  }
  if (must_not.length > 0) {
    boolQuery.must_not = must_not;
  }

  return boolQuery.must ?? boolQuery.must_not ? { bool: boolQuery } : { match_all: {} };
}

// --- Helper: Build nested AST for mixed AND/OR logic ---
function buildConditionAST(conditions: ConditionItem[]): ConditionItem {
  if (conditions.length === 0) return {} as ConditionItem;
  if (conditions.length === 1) return conditions[0];

  // For multiple conditions, create a group with AND operator by default
  // This can be enhanced later to handle mixed AND/OR logic based on logicalOperators
  return {
    id: generateId(),
    type: 'group',
    operator: 'AND',
    conditions: conditions,
  };
}

// --- Update: Use AST builder in advancedConditionsToElasticsearchQuery ---
export function advancedConditionsToElasticsearchQuery(conditions: ConditionItem[], fields: Field[]): ElasticsearchQuery {
  const validConditions = conditions.filter(condition => condition != null);
  if (validConditions.length === 0) {
    return { match_all: {} };
  }
  if (validConditions.length === 1) {
    return conditionItemToElasticsearchQuery(validConditions[0], fields);
  }

  // For multiple conditions, create a group with AND operator by default
  // This ensures proper handling of nested groups
  const group: ConditionGroup = {
    id: generateId(),
    type: 'group',
    operator: 'AND',
    conditions: validConditions,
  };

  return conditionGroupToElasticsearchQuery(group, fields);
}

// Convert a single condition item to Elasticsearch query
export function conditionItemToElasticsearchQuery(condition: ConditionItem, fields: Field[]): ElasticsearchQuery {
  // --- FIX: Add null check to prevent TypeError when condition is undefined ---
  if (!condition) return {};

  if (isConditionGroup(condition)) {
    return conditionGroupToElasticsearchQuery(condition, fields);
  } else {
    const field = fields.find(f => f.key === condition.field);
    if (!field) return {};
    return convertFilterToElasticsearchQuery(condition, field);
  }
}

// Convert a condition group to Elasticsearch query
export function conditionGroupToElasticsearchQuery(group: ConditionGroup, fields: Field[]): ElasticsearchQuery {
  if (group.conditions.length === 0) {
    return { match_all: {} };
  }
  if (group.conditions.length === 1) {
    return conditionItemToElasticsearchQuery(group.conditions[0], fields);
  }
  if (group.logicalOperators && group.logicalOperators.length > 0) {
    const ast = buildConditionAST(group.conditions);
    return conditionItemToElasticsearchQuery(ast, fields);
  } else {
    // Use the group's default operator for all conditions
    const boolQuery: Record<string, unknown> = {};
    if (group.operator === 'AND') {
      boolQuery.must = group.conditions.map(condition => conditionItemToElasticsearchQuery(condition, fields));
    } else if (group.operator === 'OR') {
      boolQuery.should = group.conditions.map(condition => conditionItemToElasticsearchQuery(condition, fields));
      boolQuery.minimum_should_match = 1;
    }
    return { bool: boolQuery };
  }
}

// Convert a single filter to Elasticsearch query
function convertFilterToElasticsearchQuery(filter: Filter, field: Field): ElasticsearchQuery {
  if (!filter || !field) {
    return {};
  }
  const { field: fieldName, operator, value } = filter;

  switch (field.type) {
  case 'string':
    return convertStringFilter(fieldName, operator, value as string);
  case 'number':
    return convertNumberFilter(fieldName, operator, value as number);
  case 'boolean':
    return convertBooleanFilter(fieldName, operator, value as boolean);
  case 'enum':
    return convertEnumFilter(fieldName, operator, value as string);
  case 'date':
    return convertDateFilter(fieldName, operator, value as string);
  default:
    return { match: { [fieldName]: value } };
  }
}

function convertStringFilter(fieldName: string, operator: string, value: string): ElasticsearchQuery {
  switch (operator) {
  case '=':
    return { term: { [fieldName]: value } };
  case '!=':
    return { term: { [fieldName]: value } };
  case 'contains':
    return { match: { [fieldName]: value } };
  case 'startsWith':
    return { prefix: { [fieldName]: value } };
  case 'endsWith':
    return { wildcard: { [fieldName]: `*${value}` } };
  case 'wildcard':
    return { wildcard: { [fieldName]: value } };
  case 'prefix':
    return { prefix: { [fieldName]: value } };
  case 'regexp':
    return { regexp: { [fieldName]: value } };
  case 'fuzzy':
    return { fuzzy: { [fieldName]: { value } } };
  default:
    return { match: { [fieldName]: value } };
  }
}

function convertNumberFilter(fieldName: string, operator: string, value: number): ElasticsearchQuery {
  switch (operator) {
  case '=':
    return { term: { [fieldName]: value } };
  case '!=':
    return { term: { [fieldName]: value } };
  case '>':
    return { range: { [fieldName]: { gt: value } } };
  case '<':
    return { range: { [fieldName]: { lt: value } } };
  case '>=':
    return { range: { [fieldName]: { gte: value } } };
  case '<=':
    return { range: { [fieldName]: { lte: value } } };
  default:
    return { term: { [fieldName]: value } };
  }
}

function convertBooleanFilter(fieldName: string, operator: string, value: boolean): ElasticsearchQuery {
  switch (operator) {
  case '=':
  case '!=':
    return { term: { [fieldName]: value } };
  default:
    return { term: { [fieldName]: value } };
  }
}

function convertEnumFilter(fieldName: string, operator: string, value: string): ElasticsearchQuery {
  switch (operator) {
  case '=':
  case '!=':
    return { term: { [fieldName]: value } };
  default:
    return { term: { [fieldName]: value } };
  }
}

function convertDateFilter(fieldName: string, operator: string, value: string): ElasticsearchQuery {
  switch (operator) {
  case '=':
    return { term: { [fieldName]: value } };
  case '!=':
    return { term: { [fieldName]: value } };
  case '>':
    return { range: { [fieldName]: { gt: value } } };
  case '<':
    return { range: { [fieldName]: { lt: value } } };
  case '>=':
    return { range: { [fieldName]: { gte: value } } };
  case '<=':
    return { range: { [fieldName]: { lte: value } } };
  default:
    return { term: { [fieldName]: value } };
  }
}

/**
 * Gets the available operators for a field type
 * @param field - The field to get operators for
 * @returns Array of available operators for the field type
 */
export function getOperatorsForField(field: Field): string[] {
  return OPERATORS[field.type] || [];
}

/**
 * Validates a value against a field's type constraints
 * @param value - The value to validate
 * @param field - The field definition to validate against
 * @returns True if the value is valid for the field type, false otherwise
 */
export function validateValue(value: string, field: Field): boolean {
  if (!value.trim()) return false;

  switch (field.type) {
  case 'number':
    return !isNaN(Number(value));
  case 'boolean':
    return value.toLowerCase() === 'true' || value.toLowerCase() === 'false';
  case 'date':
    return !isNaN(new Date(value).getTime());
  case 'enum':
    return field.values ? field.values.includes(value) : true;
  default:
    return true;
  }
}

/**
 * Parses a string value to the appropriate type based on the field type
 * @param value - The string value to parse
 * @param field - The field definition
 * @param translation - Optional translation object for boolean values
 * @returns The parsed value
 */
export function parseValue(value: string, field: Field, translation?: { booleanValues: { true: string; false: string } }): string | number | boolean {
  switch (field.type) {
  case 'number':
    return Number(value);
  case 'boolean': {
    const lowerValue = value.toLowerCase();
    // Check against English values
    if (lowerValue === 'true') return true;
    if (lowerValue === 'false') return false;
    // Check against translated values if available
    if (translation) {
      if (lowerValue === translation.booleanValues.true.toLowerCase()) return true;
      if (lowerValue === translation.booleanValues.false.toLowerCase()) return false;
    }
    // Fallback to English check
    return lowerValue === 'true';
  }
  default:
    return value;
  }
}

/**
 * Creates an HTML element with optional class name and attributes
 * @template K - The HTML tag name
 * @param tag - The HTML tag name
 * @param className - Optional CSS class name
 * @param attributes - Optional attributes to set on the element
 * @returns The created HTML element
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attributes?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  return element;
}

/**
 * Adds multiple event listeners to an element and returns a cleanup function
 * @param element - The element to add listeners to
 * @param handlers - Object mapping event types to handler functions
 * @returns Function to remove all added event listeners
 */
export function addEventListeners(
  element: HTMLElement,
  handlers: Partial<Record<keyof HTMLElementEventMap, (event: Event) => void>>,
): () => void {
  const cleanupFunctions: (() => void)[] = [];

  Object.entries(handlers).forEach(([eventType, handler]) => {
    element.addEventListener(eventType, handler);
    cleanupFunctions.push(() => element.removeEventListener(eventType, handler));
  });

  return () => cleanupFunctions.forEach(cleanup => cleanup());
}

/**
 * Checks if a click event occurred outside of the specified element
 * @param element - The element to check against
 * @param event - The mouse event to check
 * @returns True if the click was outside the element, false otherwise
 */
export function isClickOutside(element: HTMLElement, event: MouseEvent): boolean {
  const contains = element.contains(event.target as Node);
  return !contains;
}

// Field utilities
/**
 * Finds a field by its key
 * @param fields - Array of fields to search in
 * @param key - The key to search for
 * @returns The field if found, undefined otherwise
 */
export function getFieldByKey(fields: Field[], key: string): Field | undefined {
  return fields.find(field => field.key === key);
}

/**
 * Formats a filter for display purposes
 * @param filter - The filter to format
 * @param fields - Array of field definitions
 * @returns Formatted string representation of the filter
 */
export function formatFilterDisplay(filter: Filter, fields: Field[]): string {
  const field = fields.find(f => f.key === filter.field);
  const fieldLabel = field?.label || filter.field;
  return `${fieldLabel} ${filter.operator} ${filter.value}`;
}

// Advanced query utilities
/**
 * Gets the available logical operators
 * @returns Array of logical operator strings
 */
export function getLogicalOperators(): string[] {
  return ['AND', 'OR'];
}

/**
 * Creates a new condition group
 * @param operator - The logical operator for the group (default: 'AND')
 * @returns A new condition group
 */
export function createConditionGroup(operator: LogicalOperator = 'AND'): ConditionGroup {
  return {
    id: generateId(),
    type: 'group',
    operator,
    conditions: [],
  };
}

/**
 * Adds a filter to a condition group
 * @param group - The condition group to add the filter to
 * @param filter - The filter to add
 */
export function addFilterToGroup(group: ConditionGroup, filter: Filter): void {
  group.conditions.push(filter);
}

/**
 * Removes a condition from a condition group by ID
 * @param group - The condition group to remove from
 * @param conditionId - The ID of the condition to remove
 */
export function removeConditionFromGroup(group: ConditionGroup, conditionId: string): void {
  group.conditions = group.conditions.filter(condition => {
    if (isConditionGroup(condition)) {
      removeConditionFromGroup(condition, conditionId);
      return condition.conditions.length > 0;
    }
    return condition.id !== conditionId;
  });
}

/**
 * Finds a condition by its ID in a nested structure
 * @param conditions - Array of condition items to search in
 * @param id - The ID to search for
 * @returns The condition if found, null otherwise
 */
export function findConditionById(conditions: ConditionItem[], id: string): ConditionItem | null {
  for (const condition of conditions) {
    if (condition.id === id) {
      return condition;
    }
    if (isConditionGroup(condition)) {
      const found = findConditionById(condition.conditions, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Infers field definitions from data array
 * @template TData - The type of data being analyzed
 * @param data - Array of data to analyze
 * @returns Array of inferred field definitions
 */
export function inferFieldsFromData<TData = Record<string, unknown>>(data: TData[]): Field[] {
  return inferFieldsFromDataWithOptions(data, 10);
}

/**
 * Infers field definitions from data array with custom options
 * @template TData - The type of data being analyzed
 * @param data - Array of data to analyze
 * @param enumThreshold - Maximum number of unique values to consider as enum
 * @returns Array of inferred field definitions
 */
export function inferFieldsFromDataWithOptions<TData = Record<string, unknown>>(
  data: TData[],
  enumThreshold = 10,
): Field[] {
  if (!data || data.length === 0) return [];

  const sample = data.slice(0, Math.min(100, data.length));
  const fields: Field[] = [];

  // Get all unique keys from the sample
  const keys = new Set<string>();
  sample.forEach(item => {
    if (item && typeof item === 'object') {
      Object.keys(item).forEach(key => keys.add(key));
    }
  });

  keys.forEach(key => {
    const fieldInfo = inferFieldType(sample, key, enumThreshold);
    fields.push({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      type: fieldInfo.type,
      ...fieldInfo.additionalProps,
    });
  });

  return fields;
}

/**
 * Infers the type of a field from data
 * @template TData - The type of data being analyzed
 * @param data - Array of data to analyze
 * @param key - The field key to infer type for
 * @param enumThreshold - Maximum number of unique values to consider as enum
 * @returns Object containing the inferred type and additional properties
 */
function inferFieldType<TData = Record<string, unknown>>(
  data: TData[],
  key: string,
  enumThreshold = 10,
): { type: FieldType; additionalProps?: Record<string, unknown> } {
  const values = data
    .map(item => (item as Record<string, unknown>)?.[key])
    .filter(value => value !== undefined && value !== null);

  if (values.length === 0) {
    return { type: 'string' };
  }

  // Check if all values are booleans
  if (values.every(value => typeof value === 'boolean')) {
    return { type: 'boolean' };
  }

  // Check if all values are numbers
  if (values.every(value => typeof value === 'number' && !isNaN(value))) {
    return { type: 'number' };
  }

  // Check if all values are valid dates
  const dateValues = values.filter(value => {
    if (typeof value === 'string') {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return false;
  });

  if (dateValues.length === values.length) {
    return { type: 'date' };
  }

  // Check if it's an enum (limited unique values)
  const uniqueValues = [...new Set(values.map(String))];
  if (uniqueValues.length <= enumThreshold && uniqueValues.length > 0) {
    return {
      type: 'enum',
      additionalProps: { values: uniqueValues },
    };
  }

  // Default to string
  return { type: 'string' };
}

// Convert QueryChips filters to SQL query
/**
 * Converts QueryChips filters to SQL query
 * @param filters - Array of filters to convert
 * @param fields - Field definitions for filtering
 * @param advancedFilters - Advanced filter state for complex queries
 * @returns SQL query object with query string and parameters
 */
export function filtersToSQLQuery(filters: Filter[], fields: Field[], advancedFilters?: AdvancedFilterState): SQLQuery {
  const tableName = '{{table}}';
  if (advancedFilters && advancedFilters.conditions.length > 0) {
    return advancedConditionsToSQLQuery(advancedFilters.conditions, fields, advancedFilters.logicalOperators, tableName);
  }

  if (filters.length === 0) {
    return { query: `SELECT * FROM ${tableName}` };
  }

  const conditions: string[] = [];
  const parameters: unknown[] = [];

  filters.forEach(filter => {
    const field = fields.find(f => f.key === filter.field);
    if (!field) return;

    const { condition, param } = convertFilterToSQLCondition(filter, field);
    if (condition) {
      conditions.push(condition);
      if (param !== null) parameters.push(param);
    }
  });

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT * FROM ${tableName} ${whereClause}`.trim();

  return { query, parameters, table: tableName };
}

// Convert advanced conditions to SQL
/**
 * Converts advanced conditions to SQL query
 * @param conditions - Array of condition items to convert
 * @param fields - Field definitions for filtering
 * @param logicalOperators - Logical operators between conditions
 * @param tableName - The table name to use in the query (default: '{{table}}')
 * @returns SQL query object with query string and parameters
 */
export function advancedConditionsToSQLQuery(conditions: ConditionItem[], fields: Field[], logicalOperators: LogicalOperator[] = [], tableName = '{{table}}'): SQLQuery {
  const validConditions = conditions.filter(condition => condition != null);
  if (validConditions.length === 0) {
    return { query: `SELECT * FROM ${tableName}` };
  }

  const { whereClause, parameters } = buildSQLWhereClause(validConditions, logicalOperators, fields);
  const query = `SELECT * FROM ${tableName} ${whereClause}`.trim();

  return { query, parameters, table: tableName };
}

// Build SQL WHERE clause from conditions
function buildSQLWhereClause(conditions: ConditionItem[], logicalOperators: LogicalOperator[], fields: Field[]): { whereClause: string; parameters: unknown[] } {
  if (conditions.length === 1) {
    const { condition, param } = conditionItemToSQLCondition(conditions[0], fields);
    return {
      whereClause: condition ? `WHERE ${condition}` : '',
      parameters: param !== null ? [param] : [],
    };
  }

  const conditionsList: string[] = [];
  const parameters: unknown[] = [];

  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i];
    const { condition: sqlCondition, param } = conditionItemToSQLCondition(condition, fields);

    if (sqlCondition) {
      conditionsList.push(sqlCondition);
      if (param !== null) parameters.push(param);
    }

    if (i < logicalOperators.length) {
      conditionsList.push(logicalOperators[i]);
    }
  }

  const whereClause = conditionsList.length > 0 ? `WHERE ${conditionsList.join(' ')}` : '';
  return { whereClause, parameters };
}

// Convert condition item to SQL condition
function conditionItemToSQLCondition(condition: ConditionItem, fields: Field[]): { condition: string; param: unknown } {
  if (!condition) return { condition: '', param: null };

  if (isConditionGroup(condition)) {
    return conditionGroupToSQLCondition(condition, fields);
  } else {
    const field = fields.find(f => f.key === condition.field);
    if (!field) return { condition: '', param: null };
    return convertFilterToSQLCondition(condition, field);
  }
}

// Convert condition group to SQL condition
function conditionGroupToSQLCondition(group: ConditionGroup, fields: Field[]): { condition: string; param: unknown } {
  if (group.conditions.length === 0) {
    return { condition: '', param: null };
  }

  const conditionsList: string[] = [];
  const parameters: unknown[] = [];

  for (let i = 0; i < group.conditions.length; i++) {
    const condition = group.conditions[i];
    const { condition: sqlCondition, param } = conditionItemToSQLCondition(condition, fields);

    if (sqlCondition) {
      conditionsList.push(sqlCondition);
      if (param !== null) parameters.push(param);
    }

    if (i < (group.logicalOperators?.length || 0)) {
      conditionsList.push(group.logicalOperators![i]);
    }
  }

  const groupCondition = conditionsList.length > 0 ? `(${conditionsList.join(' ')})` : '';
  return { condition: groupCondition, param: parameters.length === 1 ? parameters[0] : null };
}

// Convert filter to SQL condition
function convertFilterToSQLCondition(filter: Filter, field: Field): { condition: string; param: unknown } {
  const { field: fieldName, operator, value } = filter;

  switch (field.type) {
  case 'string':
    return convertStringFilterToSQL(fieldName, operator, value as string);
  case 'number':
    return convertNumberFilterToSQL(fieldName, operator, value as number);
  case 'boolean':
    return convertBooleanFilterToSQL(fieldName, operator, value as boolean);
  case 'enum':
    return convertEnumFilterToSQL(fieldName, operator, value as string);
  case 'date':
    return convertDateFilterToSQL(fieldName, operator, value as string);
  default:
    return { condition: '', param: null };
  }
}

function convertStringFilterToSQL(fieldName: string, operator: string, value: string): { condition: string; param: unknown } {
  switch (operator) {
  case '=':
    return { condition: `${fieldName} = ?`, param: value };
  case '!=':
    return { condition: `${fieldName} != ?`, param: value };
  case 'contains':
    return { condition: `${fieldName} LIKE ?`, param: `%${value}%` };
  case 'startsWith':
    return { condition: `${fieldName} LIKE ?`, param: `${value}%` };
  case 'endsWith':
    return { condition: `${fieldName} LIKE ?`, param: `%${value}` };
  case 'wildcard':
    return { condition: `${fieldName} LIKE ?`, param: value.replace(/\*/g, '%').replace(/\?/g, '_') };
  default:
    return { condition: `${fieldName} = ?`, param: value };
  }
}

function convertNumberFilterToSQL(fieldName: string, operator: string, value: number): { condition: string; param: unknown } {
  switch (operator) {
  case '=':
    return { condition: `${fieldName} = ?`, param: value };
  case '!=':
    return { condition: `${fieldName} != ?`, param: value };
  case '>':
    return { condition: `${fieldName} > ?`, param: value };
  case '<':
    return { condition: `${fieldName} < ?`, param: value };
  case '>=':
    return { condition: `${fieldName} >= ?`, param: value };
  case '<=':
    return { condition: `${fieldName} <= ?`, param: value };
  default:
    return { condition: `${fieldName} = ?`, param: value };
  }
}

function convertBooleanFilterToSQL(fieldName: string, operator: string, value: boolean): { condition: string; param: unknown } {
  switch (operator) {
  case '=':
  case '!=':
    return { condition: `${fieldName} ${operator} ?`, param: value };
  default:
    return { condition: `${fieldName} = ?`, param: value };
  }
}

function convertEnumFilterToSQL(fieldName: string, operator: string, value: string): { condition: string; param: unknown } {
  switch (operator) {
  case '=':
  case '!=':
    return { condition: `${fieldName} ${operator} ?`, param: value };
  default:
    return { condition: `${fieldName} = ?`, param: value };
  }
}

function convertDateFilterToSQL(fieldName: string, operator: string, value: string): { condition: string; param: unknown } {
  switch (operator) {
  case '=':
    return { condition: `${fieldName} = ?`, param: value };
  case '!=':
    return { condition: `${fieldName} != ?`, param: value };
  case '>':
    return { condition: `${fieldName} > ?`, param: value };
  case '<':
    return { condition: `${fieldName} < ?`, param: value };
  case '>=':
    return { condition: `${fieldName} >= ?`, param: value };
  case '<=':
    return { condition: `${fieldName} <= ?`, param: value };
  default:
    return { condition: `${fieldName} = ?`, param: value };
  }
}

// Convert QueryChips filters to MongoDB query
/**
 * Converts QueryChips filters to MongoDB query
 * @param filters - Array of filters to convert
 * @param fields - Field definitions for filtering
 * @param advancedFilters - Advanced filter state for complex queries
 * @returns MongoDB query object
 */
export function filtersToMongoDBQuery(filters: Filter[], fields: Field[], advancedFilters?: AdvancedFilterState): MongoDBQuery {
  if (advancedFilters && advancedFilters.conditions.length > 0) {
    return advancedConditionsToMongoDBQuery(advancedFilters.conditions, fields, advancedFilters.logicalOperators);
  }

  if (filters.length === 0) {
    return { filter: {} };
  }

  const filter: Record<string, unknown> = {};

  filters.forEach(filterItem => {
    const field = fields.find(f => f.key === filterItem.field);
    if (!field) return;

    const mongoFilter = convertFilterToMongoDBFilter(filterItem, field);
    if (mongoFilter) {
      Object.assign(filter, mongoFilter);
    }
  });

  return { filter };
}

// Convert advanced conditions to MongoDB query
/**
 * Converts advanced conditions to MongoDB query
 * @param conditions - Array of condition items to convert
 * @param fields - Field definitions for filtering
 * @param logicalOperators - Logical operators between conditions
 * @returns MongoDB query object
 */
export function advancedConditionsToMongoDBQuery(conditions: ConditionItem[], fields: Field[], logicalOperators: LogicalOperator[] = []): MongoDBQuery {
  const validConditions = conditions.filter(condition => condition != null);
  if (validConditions.length === 0) {
    return { filter: {} };
  }

  const filter = buildMongoDBFilter(validConditions, logicalOperators, fields);
  return { filter };
}

// Build MongoDB filter from conditions
function buildMongoDBFilter(conditions: ConditionItem[], logicalOperators: LogicalOperator[], fields: Field[]): Record<string, unknown> {
  if (conditions.length === 1) {
    return conditionItemToMongoDBFilter(conditions[0], fields);
  }

  const filters: Record<string, unknown>[] = [];
  const operators: string[] = [];

  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i];
    const mongoFilter = conditionItemToMongoDBFilter(condition, fields);

    if (Object.keys(mongoFilter).length > 0) {
      filters.push(mongoFilter);
    }

    if (i < logicalOperators.length) {
      operators.push(logicalOperators[i] === 'AND' ? '$and' : '$or');
    }
  }

  if (filters.length === 1) {
    return filters[0];
  }

  // Group by operator
  const andFilters: Record<string, unknown>[] = [];
  const orFilters: Record<string, unknown>[] = [];
  let currentOperator = 'AND';

  for (let i = 0; i < filters.length; i++) {
    if (i < operators.length) {
      currentOperator = operators[i] === '$and' ? 'AND' : 'OR';
    }

    if (currentOperator === 'AND') {
      andFilters.push(filters[i]);
    } else {
      orFilters.push(filters[i]);
    }
  }

  const result: Record<string, unknown> = {};

  if (andFilters.length > 0) {
    if (andFilters.length === 1) {
      Object.assign(result, andFilters[0]);
    } else {
      result.$and = andFilters;
    }
  }

  if (orFilters.length > 0) {
    if (orFilters.length === 1) {
      Object.assign(result, orFilters[0]);
    } else {
      result.$or = orFilters;
    }
  }

  return result;
}

// Convert condition item to MongoDB filter
function conditionItemToMongoDBFilter(condition: ConditionItem, fields: Field[]): Record<string, unknown> {
  if (!condition) return {};

  if (isConditionGroup(condition)) {
    return conditionGroupToMongoDBFilter(condition, fields);
  } else {
    const field = fields.find(f => f.key === condition.field);
    if (!field) return {};
    return convertFilterToMongoDBFilter(condition, field);
  }
}

// Convert condition group to MongoDB filter
function conditionGroupToMongoDBFilter(group: ConditionGroup, fields: Field[]): Record<string, unknown> {
  if (group.conditions.length === 0) {
    return {};
  }

  if (group.conditions.length === 1) {
    return conditionItemToMongoDBFilter(group.conditions[0], fields);
  }

  const filters: Record<string, unknown>[] = [];
  const operators: string[] = [];

  for (let i = 0; i < group.conditions.length; i++) {
    const condition = group.conditions[i];
    const mongoFilter = conditionItemToMongoDBFilter(condition, fields);

    if (Object.keys(mongoFilter).length > 0) {
      filters.push(mongoFilter);
    }

    if (i < (group.logicalOperators?.length || 0)) {
      operators.push(group.logicalOperators![i] === 'AND' ? '$and' : '$or');
    }
  }

  if (filters.length === 1) {
    return filters[0];
  }

  const operator = group.operator === 'AND' ? '$and' : '$or';
  return { [operator]: filters };
}

// Convert filter to MongoDB filter
function convertFilterToMongoDBFilter(filter: Filter, field: Field): Record<string, unknown> {
  const { field: fieldName, operator, value } = filter;

  switch (field.type) {
  case 'string':
    return convertStringFilterToMongoDB(fieldName, operator, value as string);
  case 'number':
    return convertNumberFilterToMongoDB(fieldName, operator, value as number);
  case 'boolean':
    return convertBooleanFilterToMongoDB(fieldName, operator, value as boolean);
  case 'enum':
    return convertEnumFilterToMongoDB(fieldName, operator, value as string);
  case 'date':
    return convertDateFilterToMongoDB(fieldName, operator, value as string);
  default:
    return {};
  }
}

function convertStringFilterToMongoDB(fieldName: string, operator: string, value: string): Record<string, unknown> {
  switch (operator) {
  case '=':
    return { [fieldName]: value };
  case '!=':
    return { [fieldName]: { $ne: value } };
  case 'contains':
    return { [fieldName]: { $regex: value, $options: 'i' } };
  case 'startsWith':
    return { [fieldName]: { $regex: `^${value}`, $options: 'i' } };
  case 'endsWith':
    return { [fieldName]: { $regex: `${value}$`, $options: 'i' } };
  case 'wildcard':
    return { [fieldName]: { $regex: value.replace(/\*/g, '.*').replace(/\?/g, '.'), $options: 'i' } };
  default:
    return { [fieldName]: value };
  }
}

function convertNumberFilterToMongoDB(fieldName: string, operator: string, value: number): Record<string, unknown> {
  switch (operator) {
  case '=':
    return { [fieldName]: value };
  case '!=':
    return { [fieldName]: { $ne: value } };
  case '>':
    return { [fieldName]: { $gt: value } };
  case '<':
    return { [fieldName]: { $lt: value } };
  case '>=':
    return { [fieldName]: { $gte: value } };
  case '<=':
    return { [fieldName]: { $lte: value } };
  default:
    return { [fieldName]: value };
  }
}

function convertBooleanFilterToMongoDB(fieldName: string, operator: string, value: boolean): Record<string, unknown> {
  switch (operator) {
  case '=':
    return { [fieldName]: value };
  case '!=':
    return { [fieldName]: { $ne: value } };
  default:
    return { [fieldName]: value };
  }
}

function convertEnumFilterToMongoDB(fieldName: string, operator: string, value: string): Record<string, unknown> {
  switch (operator) {
  case '=':
  case '!=':
    return { [fieldName]: value };
  default:
    return { [fieldName]: value };
  }
}

function convertDateFilterToMongoDB(fieldName: string, operator: string, value: string): Record<string, unknown> {
  const dateValue = new Date(value);
  switch (operator) {
  case '=':
    return { [fieldName]: dateValue };
  case '!=':
    return { [fieldName]: { $ne: dateValue } };
  case '>':
    return { [fieldName]: { $gt: dateValue } };
  case '<':
    return { [fieldName]: { $lt: dateValue } };
  case '>=':
    return { [fieldName]: { $gte: dateValue } };
  case '<=':
    return { [fieldName]: { $lte: dateValue } };
  default:
    return { [fieldName]: dateValue };
  }
}

// Convert QueryChips filters to GraphQL query
/**
 * Converts QueryChips filters to GraphQL query
 * @param filters - Array of filters to convert
 * @param fields - Field definitions for filtering
 * @param advancedFilters - Advanced filter state for complex queries
 * @returns GraphQL query object with query string and variables
 */
export function filtersToGraphQLQuery(filters: Filter[], fields: Field[], advancedFilters?: AdvancedFilterState): GraphQLQuery {
  const typeName = '{{type}}';
  if (advancedFilters && advancedFilters.conditions.length > 0) {
    return advancedConditionsToGraphQLQuery(advancedFilters.conditions, fields, advancedFilters.logicalOperators, typeName);
  }

  if (filters.length === 0) {
    return { query: `query { ${typeName.toLowerCase()} { id } }` };
  }

  const conditions: string[] = [];
  const variables: Record<string, unknown> = {};

  filters.forEach((filter) => {
    const field = fields.find(f => f.key === filter.field);
    if (!field) return;

    const { condition, variableName, variableValue } = convertFilterToGraphQLCondition(filter, field);
    if (condition) {
      conditions.push(condition);
      if (variableName) variables[variableName] = variableValue;
    }
  });

  const whereClause = conditions.length > 0 ? `(where: { ${conditions.join(', ')} })` : '';
  const query = `query(${Object.keys(variables).map(key => `$${key}: ${getGraphQLType(fields.find(f => f.key === key)?.type || 'String')}`).join(', ')}) { ${typeName.toLowerCase()}${whereClause} { id } }`;

  return { query, variables };
}

// Convert advanced conditions to GraphQL query
/**
 * Converts advanced conditions to GraphQL query
 * @param conditions - Array of condition items to convert
 * @param fields - Field definitions for filtering
 * @param logicalOperators - Logical operators between conditions
 * @param typeName - The GraphQL type name to use in the query (default: '{{type}}')
 * @returns GraphQL query object with query string and variables
 */
export function advancedConditionsToGraphQLQuery(conditions: ConditionItem[], fields: Field[], logicalOperators: LogicalOperator[] = [], typeName = '{{type}}'): GraphQLQuery {
  const validConditions = conditions.filter(condition => condition != null);
  if (validConditions.length === 0) {
    return { query: `query { ${typeName.toLowerCase()} { id } }` };
  }

  const { whereClause, variables } = buildGraphQLWhereClause(validConditions, logicalOperators, fields);
  const query = `query(${Object.keys(variables).map(key => `$${key}: ${getGraphQLType(fields.find(f => f.key === key)?.type || 'String')}`).join(', ')}) { ${typeName.toLowerCase()}${whereClause} { id } }`;

  return { query, variables };
}

// Build GraphQL WHERE clause from conditions
function buildGraphQLWhereClause(conditions: ConditionItem[], logicalOperators: LogicalOperator[], fields: Field[]): { whereClause: string; variables: Record<string, unknown> } {
  if (conditions.length === 1) {
    const { condition, variableName, variableValue } = conditionItemToGraphQLCondition(conditions[0], fields, 0);
    return {
      whereClause: condition ? `(where: { ${condition} })` : '',
      variables: variableName ? { [variableName]: variableValue } : {},
    };
  }

  const conditionsList: string[] = [];
  const variables: Record<string, unknown> = {};
  let variableIndex = 0;

  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i];
    const { condition: graphqlCondition, variableName, variableValue } = conditionItemToGraphQLCondition(condition, fields, variableIndex);

    if (graphqlCondition) {
      conditionsList.push(graphqlCondition);
      if (variableName) variables[variableName] = variableValue;
      variableIndex++;
    }

    if (i < logicalOperators.length) {
      conditionsList.push(logicalOperators[i].toLowerCase());
    }
  }

  const whereClause = conditionsList.length > 0 ? `(where: { ${conditionsList.join(' ')} })` : '';
  return { whereClause, variables };
}

// Convert condition item to GraphQL condition
function conditionItemToGraphQLCondition(condition: ConditionItem, fields: Field[], variableIndex: number): { condition: string; variableName?: string; variableValue?: unknown } {
  if (!condition) return { condition: '' };

  if (isConditionGroup(condition)) {
    return conditionGroupToGraphQLCondition(condition, fields, variableIndex);
  } else {
    const field = fields.find(f => f.key === condition.field);
    if (!field) return { condition: '' };
    return convertFilterToGraphQLCondition(condition, field);
  }
}

// Convert condition group to GraphQL condition
function conditionGroupToGraphQLCondition(group: ConditionGroup, fields: Field[], variableIndex: number): { condition: string; variableName?: string; variableValue?: unknown } {
  if (group.conditions.length === 0) {
    return { condition: '' };
  }

  const conditionsList: string[] = [];
  const variables: Record<string, unknown> = {};
  let currentVariableIndex = variableIndex;

  for (let i = 0; i < group.conditions.length; i++) {
    const condition = group.conditions[i];
    const { condition: graphqlCondition, variableName, variableValue } = conditionItemToGraphQLCondition(condition, fields, currentVariableIndex);

    if (graphqlCondition) {
      conditionsList.push(graphqlCondition);
      if (variableName) variables[variableName] = variableValue;
      currentVariableIndex++;
    }

    if (i < (group.logicalOperators?.length || 0)) {
      conditionsList.push(group.logicalOperators![i].toLowerCase());
    }
  }

  const groupCondition = conditionsList.length > 0 ? `(${conditionsList.join(' ')})` : '';
  return { condition: groupCondition };
}

// Convert filter to GraphQL condition
function convertFilterToGraphQLCondition(filter: Filter, field: Field): { condition: string; variableName?: string; variableValue?: unknown } {
  const { field: fieldName, operator, value } = filter;
  const variableName = fieldName; // Use simple field name instead of indexed

  switch (field.type) {
  case 'string':
    return convertStringFilterToGraphQL(fieldName, operator, value as string, variableName);
  case 'number':
    return convertNumberFilterToGraphQL(fieldName, operator, value as number, variableName);
  case 'boolean':
    return convertBooleanFilterToGraphQL(fieldName, operator, value as boolean, variableName);
  case 'enum':
    return convertEnumFilterToGraphQL(fieldName, operator, value as string, variableName);
  case 'date':
    return convertDateFilterToGraphQL(fieldName, operator, value as string, variableName);
  default:
    return { condition: '' };
  }
}

function convertStringFilterToGraphQL(fieldName: string, operator: string, value: string, variableName: string): { condition: string; variableName: string; variableValue: unknown } {
  switch (operator) {
  case '=':
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  case '!=':
    return { condition: `${fieldName}_ne: $${variableName}`, variableName, variableValue: value };
  case 'contains':
    return { condition: `${fieldName}_contains: $${variableName}`, variableName, variableValue: value };
  case 'startsWith':
    return { condition: `${fieldName}_starts_with: $${variableName}`, variableName, variableValue: value };
  case 'endsWith':
    return { condition: `${fieldName}_ends_with: $${variableName}`, variableName, variableValue: value };
  default:
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  }
}

function convertNumberFilterToGraphQL(fieldName: string, operator: string, value: number, variableName: string): { condition: string; variableName: string; variableValue: unknown } {
  switch (operator) {
  case '=':
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  case '!=':
    return { condition: `${fieldName}_ne: $${variableName}`, variableName, variableValue: value };
  case '>':
    return { condition: `${fieldName}_gt: $${variableName}`, variableName, variableValue: value };
  case '<':
    return { condition: `${fieldName}_lt: $${variableName}`, variableName, variableValue: value };
  case '>=':
    return { condition: `${fieldName}_gte: $${variableName}`, variableName, variableValue: value };
  case '<=':
    return { condition: `${fieldName}_lte: $${variableName}`, variableName, variableValue: value };
  default:
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  }
}

function convertBooleanFilterToGraphQL(fieldName: string, operator: string, value: boolean, variableName: string): { condition: string; variableName: string; variableValue: unknown } {
  switch (operator) {
  case '=':
  case '!=':
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  default:
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  }
}

function convertEnumFilterToGraphQL(fieldName: string, operator: string, value: string, variableName: string): { condition: string; variableName: string; variableValue: unknown } {
  switch (operator) {
  case '=':
  case '!=':
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  default:
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  }
}

function convertDateFilterToGraphQL(fieldName: string, operator: string, value: string, variableName: string): { condition: string; variableName: string; variableValue: unknown } {
  switch (operator) {
  case '=':
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  case '!=':
    return { condition: `${fieldName}_ne: $${variableName}`, variableName, variableValue: value };
  case '>':
    return { condition: `${fieldName}_gt: $${variableName}`, variableName, variableValue: value };
  case '<':
    return { condition: `${fieldName}_lt: $${variableName}`, variableName, variableValue: value };
  case '>=':
    return { condition: `${fieldName}_gte: $${variableName}`, variableName, variableValue: value };
  case '<=':
    return { condition: `${fieldName}_lte: $${variableName}`, variableName, variableValue: value };
  default:
    return { condition: `${fieldName}: $${variableName}`, variableName, variableValue: value };
  }
}

// Get GraphQL type from field type
function getGraphQLType(fieldType?: string): string {
  switch (fieldType) {
  case 'number':
    return 'Int';
  case 'boolean':
    return 'Boolean';
  case 'date':
    return 'String';
  case 'enum':
    return 'String';
  default:
    return 'String';
  }
}
