export interface QueryChipsTheme {
  // Theme mode: 'default' uses built-in styles, 'custom' uses custom CSS variables, 'none' disables all styles
  mode: 'default' | 'custom' | 'none';

  // Custom CSS variables for theming (only used when mode is 'custom')
  variables?: {
    // Container
    '--querychips-text-color'?: string;
    '--querychips-bg-color'?: string;
    '--querychips-border-color'?: string;
    '--querychips-focus-border-color'?: string;
    '--querychips-focus-shadow'?: string;

    // Input
    '--querychips-placeholder-color'?: string;

    // Tags
    '--querychips-tag-bg'?: string;
    '--querychips-tag-border'?: string;
    '--querychips-tag-text'?: string;
    '--querychips-tag-hover-bg'?: string;
    '--querychips-tag-hover-border'?: string;
    '--querychips-tag-remove-color'?: string;
    '--querychips-tag-remove-hover-bg'?: string;
    '--querychips-tag-remove-hover-color'?: string;

    // Dropdown
    '--querychips-dropdown-bg'?: string;
    '--querychips-dropdown-border'?: string;
    '--querychips-dropdown-text'?: string;
    '--querychips-dropdown-hover-bg'?: string;
    '--querychips-dropdown-selected-bg'?: string;
    '--querychips-dropdown-selected-text'?: string;

    // Filter tags
    '--querychips-filter-tag-bg'?: string;
    '--querychips-filter-tag-border'?: string;
    '--querychips-filter-tag-text'?: string;
    '--querychips-filter-tag-hover-bg'?: string;
    '--querychips-filter-tag-hover-border'?: string;
    '--querychips-filter-tag-remove-color'?: string;
    '--querychips-filter-tag-remove-hover-bg'?: string;
    '--querychips-filter-tag-remove-hover-color'?: string;

    // Validation icons
    '--querychips-valid-bg'?: string;
    '--querychips-valid-color'?: string;
    '--querychips-invalid-bg'?: string;
    '--querychips-invalid-color'?: string;
    '--querychips-incomplete-bg'?: string;
    '--querychips-incomplete-color'?: string;
  };
}

export const DEFAULT_THEME: QueryChipsTheme = {
  mode: 'default',
};

export const LIGHT_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#24292f',
    '--querychips-bg-color': '#ffffff',
    '--querychips-border-color': '#d0d7de',
    '--querychips-focus-border-color': '#0969da',
    '--querychips-focus-shadow': 'rgba(9, 105, 218, 0.3)',
    '--querychips-placeholder-color': '#656d76',
    '--querychips-tag-bg': '#f6f8fa',
    '--querychips-tag-border': '#d0d7de',
    '--querychips-tag-text': '#24292f',
    '--querychips-tag-hover-bg': '#f0f3f6',
    '--querychips-tag-hover-border': '#8c959f',
    '--querychips-tag-remove-color': '#656d76',
    '--querychips-tag-remove-hover-bg': '#d0d7de',
    '--querychips-tag-remove-hover-color': '#24292f',
    '--querychips-dropdown-bg': '#ffffff',
    '--querychips-dropdown-border': '#d0d7de',
    '--querychips-dropdown-text': '#24292f',
    '--querychips-dropdown-hover-bg': '#f6f8fa',
    '--querychips-dropdown-selected-bg': '#0969da',
    '--querychips-dropdown-selected-text': '#ffffff',
    '--querychips-filter-tag-bg': '#ddf4d8',
    '--querychips-filter-tag-border': '#1a7f37',
    '--querychips-filter-tag-text': '#1a7f37',
    '--querychips-filter-tag-hover-bg': '#c8e6c9',
    '--querychips-filter-tag-hover-border': '#2da44e',
    '--querychips-filter-tag-remove-color': '#1a7f37',
    '--querychips-filter-tag-remove-hover-bg': '#2da44e',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#ddf4d8',
    '--querychips-valid-color': '#1a7f37',
    '--querychips-invalid-bg': '#ffebe9',
    '--querychips-invalid-color': '#cf222e',
    '--querychips-incomplete-bg': '#fff8c5',
    '--querychips-incomplete-color': '#9a6700',
  },
};

export const DARK_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#f0f6fc',
    '--querychips-bg-color': '#0d1117',
    '--querychips-border-color': '#30363d',
    '--querychips-focus-border-color': '#58a6ff',
    '--querychips-focus-shadow': 'rgba(56, 139, 253, 0.4)',
    '--querychips-placeholder-color': '#7d8590',
    '--querychips-tag-bg': '#21262d',
    '--querychips-tag-border': '#30363d',
    '--querychips-tag-text': '#f0f6fc',
    '--querychips-tag-hover-bg': '#30363d',
    '--querychips-tag-hover-border': '#7d8590',
    '--querychips-tag-remove-color': '#7d8590',
    '--querychips-tag-remove-hover-bg': '#30363d',
    '--querychips-tag-remove-hover-color': '#f0f6fc',
    '--querychips-dropdown-bg': '#0d1117',
    '--querychips-dropdown-border': '#30363d',
    '--querychips-dropdown-text': '#f0f6fc',
    '--querychips-dropdown-hover-bg': '#21262d',
    '--querychips-dropdown-selected-bg': '#58a6ff',
    '--querychips-dropdown-selected-text': '#0d1117',
    '--querychips-filter-tag-bg': '#1a7f37',
    '--querychips-filter-tag-border': '#2da44e',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#2da44e',
    '--querychips-filter-tag-hover-border': '#3fb950',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#3fb950',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#1a7f37',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#cf222e',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#9a6700',
    '--querychips-incomplete-color': '#ffffff',
  },
};

// Material Design Theme
export const MATERIAL_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#212121',
    '--querychips-bg-color': '#ffffff',
    '--querychips-border-color': '#e0e0e0',
    '--querychips-focus-border-color': '#2196f3',
    '--querychips-focus-shadow': 'rgba(33, 150, 243, 0.3)',
    '--querychips-placeholder-color': '#9e9e9e',
    '--querychips-tag-bg': '#e3f2fd',
    '--querychips-tag-border': '#2196f3',
    '--querychips-tag-text': '#1976d2',
    '--querychips-tag-hover-bg': '#bbdefb',
    '--querychips-tag-hover-border': '#1976d2',
    '--querychips-tag-remove-color': '#1976d2',
    '--querychips-tag-remove-hover-bg': '#2196f3',
    '--querychips-tag-remove-hover-color': '#ffffff',
    '--querychips-dropdown-bg': '#ffffff',
    '--querychips-dropdown-border': '#e0e0e0',
    '--querychips-dropdown-text': '#212121',
    '--querychips-dropdown-hover-bg': '#f5f5f5',
    '--querychips-dropdown-selected-bg': '#2196f3',
    '--querychips-dropdown-selected-text': '#ffffff',
    '--querychips-filter-tag-bg': '#4caf50',
    '--querychips-filter-tag-border': '#388e3c',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#66bb6a',
    '--querychips-filter-tag-hover-border': '#4caf50',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#66bb6a',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#4caf50',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#f44336',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#ff9800',
    '--querychips-incomplete-color': '#ffffff',
  },
};

// Material Design Dark Theme
export const MATERIAL_DARK_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#ffffff',
    '--querychips-bg-color': '#424242',
    '--querychips-border-color': '#616161',
    '--querychips-focus-border-color': '#64b5f6',
    '--querychips-focus-shadow': 'rgba(100, 181, 246, 0.3)',
    '--querychips-placeholder-color': '#bdbdbd',
    '--querychips-tag-bg': '#1976d2',
    '--querychips-tag-border': '#42a5f5',
    '--querychips-tag-text': '#ffffff',
    '--querychips-tag-hover-bg': '#1565c0',
    '--querychips-tag-hover-border': '#2196f3',
    '--querychips-tag-remove-color': '#ffffff',
    '--querychips-tag-remove-hover-bg': '#2196f3',
    '--querychips-tag-remove-hover-color': '#ffffff',
    '--querychips-dropdown-bg': '#424242',
    '--querychips-dropdown-border': '#616161',
    '--querychips-dropdown-text': '#ffffff',
    '--querychips-dropdown-hover-bg': '#616161',
    '--querychips-dropdown-selected-bg': '#64b5f6',
    '--querychips-dropdown-selected-text': '#424242',
    '--querychips-filter-tag-bg': '#388e3c',
    '--querychips-filter-tag-border': '#4caf50',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#4caf50',
    '--querychips-filter-tag-hover-border': '#66bb6a',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#66bb6a',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#388e3c',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#d32f2f',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#f57c00',
    '--querychips-incomplete-color': '#ffffff',
  },
};

// Bootstrap Theme
export const BOOTSTRAP_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#212529',
    '--querychips-bg-color': '#ffffff',
    '--querychips-border-color': '#dee2e6',
    '--querychips-focus-border-color': '#86b7fe',
    '--querychips-focus-shadow': 'rgba(13, 110, 253, 0.25)',
    '--querychips-placeholder-color': '#6c757d',
    '--querychips-tag-bg': '#e9ecef',
    '--querychips-tag-border': '#dee2e6',
    '--querychips-tag-text': '#495057',
    '--querychips-tag-hover-bg': '#dee2e6',
    '--querychips-tag-hover-border': '#adb5bd',
    '--querychips-tag-remove-color': '#6c757d',
    '--querychips-tag-remove-hover-bg': '#adb5bd',
    '--querychips-tag-remove-hover-color': '#ffffff',
    '--querychips-dropdown-bg': '#ffffff',
    '--querychips-dropdown-border': '#dee2e6',
    '--querychips-dropdown-text': '#212529',
    '--querychips-dropdown-hover-bg': '#f8f9fa',
    '--querychips-dropdown-selected-bg': '#0d6efd',
    '--querychips-dropdown-selected-text': '#ffffff',
    '--querychips-filter-tag-bg': '#198754',
    '--querychips-filter-tag-border': '#198754',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#157347',
    '--querychips-filter-tag-hover-border': '#157347',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#157347',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#198754',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#dc3545',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#ffc107',
    '--querychips-incomplete-color': '#000000',
  },
};

// Tailwind CSS Theme
export const TAILWIND_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#1f2937',
    '--querychips-bg-color': '#ffffff',
    '--querychips-border-color': '#d1d5db',
    '--querychips-focus-border-color': '#3b82f6',
    '--querychips-focus-shadow': 'rgba(59, 130, 246, 0.3)',
    '--querychips-placeholder-color': '#9ca3af',
    '--querychips-tag-bg': '#f3f4f6',
    '--querychips-tag-border': '#d1d5db',
    '--querychips-tag-text': '#374151',
    '--querychips-tag-hover-bg': '#e5e7eb',
    '--querychips-tag-hover-border': '#9ca3af',
    '--querychips-tag-remove-color': '#6b7280',
    '--querychips-tag-remove-hover-bg': '#d1d5db',
    '--querychips-tag-remove-hover-color': '#374151',
    '--querychips-dropdown-bg': '#ffffff',
    '--querychips-dropdown-border': '#d1d5db',
    '--querychips-dropdown-text': '#1f2937',
    '--querychips-dropdown-hover-bg': '#f9fafb',
    '--querychips-dropdown-selected-bg': '#3b82f6',
    '--querychips-dropdown-selected-text': '#ffffff',
    '--querychips-filter-tag-bg': '#10b981',
    '--querychips-filter-tag-border': '#059669',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#059669',
    '--querychips-filter-tag-hover-border': '#047857',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#047857',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#10b981',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#ef4444',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#f59e0b',
    '--querychips-incomplete-color': '#ffffff',
  },
};

// Ant Design Theme
export const ANT_DESIGN_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#262626',
    '--querychips-bg-color': '#ffffff',
    '--querychips-border-color': '#d9d9d9',
    '--querychips-focus-border-color': '#1890ff',
    '--querychips-focus-shadow': 'rgba(24, 144, 255, 0.2)',
    '--querychips-placeholder-color': '#bfbfbf',
    '--querychips-tag-bg': '#f0f0f0',
    '--querychips-tag-border': '#d9d9d9',
    '--querychips-tag-text': '#595959',
    '--querychips-tag-hover-bg': '#e6f7ff',
    '--querychips-tag-hover-border': '#1890ff',
    '--querychips-tag-remove-color': '#8c8c8c',
    '--querychips-tag-remove-hover-bg': '#1890ff',
    '--querychips-tag-remove-hover-color': '#ffffff',
    '--querychips-dropdown-bg': '#ffffff',
    '--querychips-dropdown-border': '#d9d9d9',
    '--querychips-dropdown-text': '#262626',
    '--querychips-dropdown-hover-bg': '#f5f5f5',
    '--querychips-dropdown-selected-bg': '#1890ff',
    '--querychips-dropdown-selected-text': '#ffffff',
    '--querychips-filter-tag-bg': '#52c41a',
    '--querychips-filter-tag-border': '#52c41a',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#73d13d',
    '--querychips-filter-tag-hover-border': '#73d13d',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#73d13d',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#52c41a',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#ff4d4f',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#faad14',
    '--querychips-incomplete-color': '#ffffff',
  },
};

// Chakra UI Theme
export const CHAKRA_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#2d3748',
    '--querychips-bg-color': '#ffffff',
    '--querychips-border-color': '#e2e8f0',
    '--querychips-focus-border-color': '#3182ce',
    '--querychips-focus-shadow': 'rgba(49, 130, 206, 0.3)',
    '--querychips-placeholder-color': '#a0aec0',
    '--querychips-tag-bg': '#edf2f7',
    '--querychips-tag-border': '#e2e8f0',
    '--querychips-tag-text': '#4a5568',
    '--querychips-tag-hover-bg': '#e2e8f0',
    '--querychips-tag-hover-border': '#cbd5e0',
    '--querychips-tag-remove-color': '#718096',
    '--querychips-tag-remove-hover-bg': '#cbd5e0',
    '--querychips-tag-remove-hover-color': '#4a5568',
    '--querychips-dropdown-bg': '#ffffff',
    '--querychips-dropdown-border': '#e2e8f0',
    '--querychips-dropdown-text': '#2d3748',
    '--querychips-dropdown-hover-bg': '#f7fafc',
    '--querychips-dropdown-selected-bg': '#3182ce',
    '--querychips-dropdown-selected-text': '#ffffff',
    '--querychips-filter-tag-bg': '#38a169',
    '--querychips-filter-tag-border': '#38a169',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#48bb78',
    '--querychips-filter-tag-hover-border': '#48bb78',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#48bb78',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#38a169',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#e53e3e',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#d69e2e',
    '--querychips-incomplete-color': '#ffffff',
  },
};

// MUI (Material-UI) Theme
export const MUI_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#1976d2',
    '--querychips-bg-color': '#ffffff',
    '--querychips-border-color': '#e0e0e0',
    '--querychips-focus-border-color': '#1976d2',
    '--querychips-focus-shadow': 'rgba(25, 118, 210, 0.2)',
    '--querychips-placeholder-color': '#757575',
    '--querychips-tag-bg': '#e3f2fd',
    '--querychips-tag-border': '#2196f3',
    '--querychips-tag-text': '#1565c0',
    '--querychips-tag-hover-bg': '#bbdefb',
    '--querychips-tag-hover-border': '#1976d2',
    '--querychips-tag-remove-color': '#1976d2',
    '--querychips-tag-remove-hover-bg': '#2196f3',
    '--querychips-tag-remove-hover-color': '#ffffff',
    '--querychips-dropdown-bg': '#ffffff',
    '--querychips-dropdown-border': '#e0e0e0',
    '--querychips-dropdown-text': '#1976d2',
    '--querychips-dropdown-hover-bg': '#f5f5f5',
    '--querychips-dropdown-selected-bg': '#1976d2',
    '--querychips-dropdown-selected-text': '#ffffff',
    '--querychips-filter-tag-bg': '#2e7d32',
    '--querychips-filter-tag-border': '#388e3c',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#388e3c',
    '--querychips-filter-tag-hover-border': '#4caf50',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#4caf50',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#2e7d32',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#d32f2f',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#f57c00',
    '--querychips-incomplete-color': '#ffffff',
  },
};

// Bulma Theme
export const BULMA_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#363636',
    '--querychips-bg-color': '#ffffff',
    '--querychips-border-color': '#dbdbdb',
    '--querychips-focus-border-color': '#3273dc',
    '--querychips-focus-shadow': 'rgba(50, 115, 220, 0.25)',
    '--querychips-placeholder-color': '#b5b5b5',
    '--querychips-tag-bg': '#f5f5f5',
    '--querychips-tag-border': '#dbdbdb',
    '--querychips-tag-text': '#4a4a4a',
    '--querychips-tag-hover-bg': '#fafafa',
    '--querychips-tag-hover-border': '#b5b5b5',
    '--querychips-tag-remove-color': '#b5b5b5',
    '--querychips-tag-remove-hover-bg': '#dbdbdb',
    '--querychips-tag-remove-hover-color': '#4a4a4a',
    '--querychips-dropdown-bg': '#ffffff',
    '--querychips-dropdown-border': '#dbdbdb',
    '--querychips-dropdown-text': '#363636',
    '--querychips-dropdown-hover-bg': '#f5f5f5',
    '--querychips-dropdown-selected-bg': '#3273dc',
    '--querychips-dropdown-selected-text': '#ffffff',
    '--querychips-filter-tag-bg': '#48c774',
    '--querychips-filter-tag-border': '#48c774',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#3ec46d',
    '--querychips-filter-tag-hover-border': '#3ec46d',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#3ec46d',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#48c774',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#f14668',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#ffdd57',
    '--querychips-incomplete-color': '#4a4a4a',
  },
};

// Foundation Theme
export const FOUNDATION_THEME: QueryChipsTheme = {
  mode: 'custom',
  variables: {
    '--querychips-text-color': '#0a0a0a',
    '--querychips-bg-color': '#ffffff',
    '--querychips-border-color': '#cacaca',
    '--querychips-focus-border-color': '#1779ba',
    '--querychips-focus-shadow': 'rgba(23, 121, 186, 0.25)',
    '--querychips-placeholder-color': '#8a8a8a',
    '--querychips-tag-bg': '#e9e9e9',
    '--querychips-tag-border': '#cacaca',
    '--querychips-tag-text': '#0a0a0a',
    '--querychips-tag-hover-bg': '#d0d0d0',
    '--querychips-tag-hover-border': '#8a8a8a',
    '--querychips-tag-remove-color': '#8a8a8a',
    '--querychips-tag-remove-hover-bg': '#cacaca',
    '--querychips-tag-remove-hover-color': '#0a0a0a',
    '--querychips-dropdown-bg': '#ffffff',
    '--querychips-dropdown-border': '#cacaca',
    '--querychips-dropdown-text': '#0a0a0a',
    '--querychips-dropdown-hover-bg': '#fefefe',
    '--querychips-dropdown-selected-bg': '#1779ba',
    '--querychips-dropdown-selected-text': '#ffffff',
    '--querychips-filter-tag-bg': '#3adb76',
    '--querychips-filter-tag-border': '#3adb76',
    '--querychips-filter-tag-text': '#ffffff',
    '--querychips-filter-tag-hover-bg': '#22c55e',
    '--querychips-filter-tag-hover-border': '#22c55e',
    '--querychips-filter-tag-remove-color': '#ffffff',
    '--querychips-filter-tag-remove-hover-bg': '#22c55e',
    '--querychips-filter-tag-remove-hover-color': '#ffffff',
    '--querychips-valid-bg': '#3adb76',
    '--querychips-valid-color': '#ffffff',
    '--querychips-invalid-bg': '#cc4b37',
    '--querychips-invalid-color': '#ffffff',
    '--querychips-incomplete-bg': '#ffae00',
    '--querychips-incomplete-color': '#ffffff',
  },
};

export function applyTheme(container: HTMLElement, theme: QueryChipsTheme): void {
  if (theme.mode === 'none') {
    // Remove all theme-related classes and styles
    container.classList.remove('querychips-themed');
    return;
  }

  // Add themed class for styling hooks
  container.classList.add('querychips-themed');

  if (theme.mode === 'custom' && theme.variables) {
    // Apply custom CSS variables
    Object.entries(theme.variables).forEach(([property, value]) => {
      if (value !== undefined) {
        container.style.setProperty(property, value);
      }
    });
  }
}
