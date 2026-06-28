// Import theme and translation types
import { QueryChipsTheme } from './themes';
import { Translation } from './translations';

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Supported field types for filtering
 */
export type FieldType = 'string' | 'number' | 'boolean' | 'enum' | 'date';

/**
 * Field configuration for QueryChips
 */
export interface Field {
  key: string;
  label: string;
  type: FieldType;
  values?: string[];
  placeholder?: string;
}

/**
 * Core filter interface for simple queries
 */
export interface Filter {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean | Date;
}

// ============================================================================
// ADVANCED QUERY TYPES
// ============================================================================

export type LogicalOperator = 'AND' | 'OR';

export interface ConditionGroup {
  id: string;
  type: 'group';
  operator: LogicalOperator;
  conditions: (Filter | ConditionGroup)[];
  logicalOperators?: LogicalOperator[];
}

export type ConditionItem = Filter | ConditionGroup;

export interface AdvancedFilterState {
  conditions: ConditionItem[];
  logicalOperators: LogicalOperator[];
  currentGroupId?: string;
}

// ============================================================================
// QUERY LANGUAGE TYPES
// ============================================================================

/**
 * SQL query interface
 */
export interface SQLQuery {
  query: string;
  parameters?: unknown[];
  table?: string;
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    groupBy?: string;
    distinct?: boolean;
    select?: string[];
  };
  valid?: boolean;
  error?: string;
}

/**
 * MongoDB query interface
 */
export interface MongoDBQuery {
  filter: Record<string, unknown>;
  options?: {
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
    projection?: Record<string, 0 | 1>;
    useAggregation?: boolean;
    pipeline?: unknown[];
  };
  valid?: boolean;
  error?: string;
}

/**
 * GraphQL query interface
 */
export interface GraphQLQuery {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  valid?: boolean;
  error?: string;
  schema?: {
    types?: string[];
    fields?: string[];
  };
}

/**
 * Elasticsearch Query Types - Exact DSL structure
 */
export interface ElasticsearchQuery {
  match?: Record<string, unknown>;
  match_phrase?: Record<string, unknown>;
  match_phrase_prefix?: Record<string, unknown>;
  multi_match?: {
    query: string;
    fields: string[];
    type?: 'best_fields' | 'most_fields' | 'cross_fields' | 'phrase' | 'phrase_prefix';
    operator?: 'or' | 'and';
    minimum_should_match?: string | number;
    fuzziness?: string;
    prefix_length?: number;
    max_expansions?: number;
  };
  term?: Record<string, unknown>;
  terms?: Record<string, unknown[]>;
  range?: Record<string, {
    gt?: number | string;
    gte?: number | string;
    lt?: number | string;
    lte?: number | string;
    format?: string;
    time_zone?: string;
    boost?: number;
  }>;
  exists?: { field: string };
  wildcard?: Record<string, unknown>;
  prefix?: Record<string, unknown>;
  regexp?: Record<string, unknown>;
  fuzzy?: Record<string, unknown>;
  ids?: { values: string[] };
  bool?: {
    must?: ElasticsearchQuery[];
    filter?: ElasticsearchQuery[];
    should?: ElasticsearchQuery[];
    must_not?: ElasticsearchQuery[];
    minimum_should_match?: number | string;
    boost?: number;
  };
  boosting?: {
    positive: ElasticsearchQuery;
    negative: ElasticsearchQuery;
    negative_boost: number;
  };
  constant_score?: {
    filter: ElasticsearchQuery;
    boost?: number;
  };
  dis_max?: {
    queries: ElasticsearchQuery[];
    tie_breaker?: number;
  };
  match_all?: { boost?: number };
  match_none?: {};
  geo_bounding_box?: Record<string, unknown>;
  geo_distance?: Record<string, unknown>;
  geo_polygon?: Record<string, unknown>;
  nested?: {
    path: string;
    query: ElasticsearchQuery;
    score_mode?: 'avg' | 'max' | 'min' | 'none' | 'sum' | 'total';
    inner_hits?: unknown;
  };
  has_child?: {
    type: string;
    query: ElasticsearchQuery;
    score_mode?: 'none' | 'avg' | 'max' | 'min' | 'sum' | 'total';
    min_children?: number;
    max_children?: number;
    inner_hits?: unknown;
  };
  has_parent?: {
    parent_type: string;
    query: ElasticsearchQuery;
    score?: boolean;
    inner_hits?: unknown;
  };
  valid?: boolean;
  error?: string;
}

export type QueryLanguage = 'elasticsearch' | 'sql' | 'mongodb' | 'graphql';

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Main QueryChips state interface
 */
export interface QueryChipsState {
  filters: Filter[];
  currentStep: 'field' | 'operator' | 'value' | 'logical' | 'group';
  selectedField?: Field;
  selectedOperator?: string;
  inputValue: string;
  isDropdownOpen: boolean;
  dropdownOptions: string[];
  selectedOptionIndex: number;
  advancedFilters?: AdvancedFilterState;
  selectedLogicalOperator?: LogicalOperator;
}

/**
 * Main QueryChips configuration interface
 * @template TData - The type of data being filtered (default: Record<string, unknown>)
 */
export interface QueryChipsConfig<TData = Record<string, unknown>> {
  data: TData[];
  fields?: Field[];
  autoApply?: boolean;
  onChange?: (filteredData: TData[], state: QueryChipsState) => void;
  onQueryChange?: (queries: {
    elasticsearch?: ElasticsearchQuery;
    sql?: SQLQuery;
    mongodb?: MongoDBQuery;
    graphql?: GraphQLQuery;
  }, state: QueryChipsState) => void;
  container?: HTMLElement;
  inferFields?: boolean;
  enumThreshold?: number;
  queryLanguages?: QueryLanguage[];
  theme?: QueryChipsTheme;
  language?: string;
  translation?: Translation;
  /**
   * Optionally provide a default query (simple or advanced format)
   */
  defaultQuery?: Filter[] | AdvancedFilterState;
  /**
   * Enable debug mode for enhanced error logging
   */
  debugMode?: boolean;
  /**
   * Error callback for handling errors
   */
  onError?: (error: any) => void;
  /**
   * Performance monitoring callback
   */
  onPerformanceUpdate?: (metrics: any) => void;
  /**
   * Memory management options
   */
  memoryOptions?: {
    memoryThreshold?: number;
    enableMemoryMonitoring?: boolean;
  };
  /**
   * Performance monitoring options
   */
  performanceOptions?: {
    enabled?: boolean;
    maxEvents?: number;
    throttleInterval?: number;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Default operators for each field type
 */
export const OPERATORS: Record<FieldType, string[]> = {
  string: ['=', '!=', 'contains', 'startsWith', 'endsWith', 'wildcard', 'prefix', 'regexp', 'fuzzy', 'like', 'not_like', 'regex', 'not_regex'/* , 'is_null', 'is_not_null'*/],
  number: ['=', '!=', '>', '<', '>=', '<=', 'between', 'not_between'/* , 'in', 'not_in', 'is_null', 'is_not_null'*/],
  boolean: ['=', '!='/* , 'is_null', 'is_not_null'*/],
  enum: ['=', '!='/* , 'in', 'not_in', 'is_null', 'is_not_null'*/],
  date: ['=', '!=', '>', '<', '>=', '<=', 'between', 'not_between'/* , 'is_null', 'is_not_null'*/],
};

