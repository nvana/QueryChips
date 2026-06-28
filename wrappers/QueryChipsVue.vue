<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { QueryChips, QueryChipsConfig, Filter, AdvancedFilterState } from 'querychips';

const props = defineProps<QueryChipsConfig & { defaultQuery?: Filter[] | AdvancedFilterState }>();
const emit = defineEmits(['change']);
const container = ref<HTMLElement | null>(null);
let queryChips: QueryChips | null = null;

onMounted(() => {
  if (container.value) {
    try {
      queryChips = new QueryChips({
        ...props,
        defaultQuery: props.defaultQuery,
        onChange: (filtered, state) => emit('change', filtered, state),
      });
      queryChips.mount(container.value);
    } catch (error) {
      console.error('Failed to initialize QueryChips:', error);
    }
  }
});

onBeforeUnmount(() => {
  if (queryChips) {
    try {
      queryChips.destroy();
    } catch (error) {
      console.warn('Error destroying QueryChips instance:', error);
    }
    queryChips = null;
  }
});

// Watch for data changes and update the QueryChips instance
watch(
  () => props.data,
  (newData: any[]) => {
    if (queryChips) {
      try {
        queryChips.updateConfig({ data: newData, defaultQuery: props.defaultQuery });
      } catch (error) {
        console.error('Failed to update QueryChips data:', error);
      }
    }
  },
  { deep: true }
);

// Watch for field configuration changes
watch(
  () => [props.fields, props.inferFields, props.enumThreshold],
  () => {
    if (queryChips) {
      try {
        queryChips.updateConfig({ 
          fields: props.fields,
          inferFields: props.inferFields,
          enumThreshold: props.enumThreshold,
          defaultQuery: props.defaultQuery,
        });
      } catch (error) {
        console.error('Failed to update QueryChips fields:', error);
      }
    }
  },
  { deep: true }
);

// Watch for other configuration changes
watch(
  () => [
    props.autoApply,
    props.onChange,
    props.onQueryChange,
    props.theme,
    props.language,
    props.translation,
    props.queryLanguages,
    props.defaultQuery,
  ],
  () => {
    if (queryChips) {
      try {
        queryChips.updateConfig({
          autoApply: props.autoApply,
          onChange: props.onChange,
          onQueryChange: props.onQueryChange,
          theme: props.theme,
          language: props.language,
          translation: props.translation,
          queryLanguages: props.queryLanguages,
          defaultQuery: props.defaultQuery,
        });
      } catch (error) {
        console.error('Failed to update QueryChips config:', error);
      }
    }
  },
  { deep: true }
);
</script> 