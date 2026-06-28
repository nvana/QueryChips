import React, { useEffect, useRef, useCallback } from 'react';
import { QueryChips, QueryChipsConfig, Filter, AdvancedFilterState } from 'querychips';

export interface QueryChipsReactProps extends QueryChipsConfig {
  /**
   * Optionally provide a default query (simple or advanced format)
   */
  defaultQuery?: Filter[] | AdvancedFilterState;
}

export const QueryChipsReact: React.FC<QueryChipsReactProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const queryChipsRef = useRef<QueryChips | null>(null);

  // Memoize the onChange callback to prevent unnecessary re-renders
  const handleChange = useCallback((filteredData: any[], state: any) => {
    if (props.onChange) {
      props.onChange(filteredData, state);
    }
  }, [props.onChange]);

  // Memoize the onQueryChange callback
  const handleQueryChange = useCallback((queries: any, state: any) => {
    if (props.onQueryChange) {
      props.onQueryChange(queries, state);
    }
  }, [props.onQueryChange]);

  // Create QueryChips instance
  useEffect(() => {
    if (containerRef.current && !queryChipsRef.current) {
      try {
        queryChipsRef.current = new QueryChips({
          ...props,
          defaultQuery: props.defaultQuery,
          onChange: handleChange,
          onQueryChange: handleQueryChange,
        });
        queryChipsRef.current.mount(containerRef.current);
      } catch (error) {
        console.error('Failed to initialize QueryChips:', error);
      }
    }

    return () => {
      if (queryChipsRef.current) {
        try {
          queryChipsRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying QueryChips instance:', error);
        }
        queryChipsRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Update QueryChips instance when relevant props change
  useEffect(() => {
    if (queryChipsRef.current) {
      try {
        queryChipsRef.current.updateConfig({
          ...props,
          defaultQuery: props.defaultQuery,
          onChange: handleChange,
          onQueryChange: handleQueryChange,
        });
      } catch (error) {
        console.error('Failed to update QueryChips config:', error);
      }
    }
  }, [
    props.data,
    props.fields,
    props.inferFields,
    props.enumThreshold,
    props.autoApply,
    props.onChange,
    props.onQueryChange,
    props.theme,
    props.language,
    props.translation,
    props.queryLanguages,
    props.defaultQuery,
    handleChange,
    handleQueryChange,
  ]);

  return <div ref={containerRef} />;
};
