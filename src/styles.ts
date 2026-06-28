export const STYLES = `
/* Base styles - only applied when theme mode is not 'none' */
.querychips-themed .querychips-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: var(--querychips-text-color, #24292f);
  background: var(--querychips-bg-color, #ffffff);
  border: 1px solid var(--querychips-border-color, #d0d7de);
  border-radius: 6px;
  padding: 8px 12px;
  min-height: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  position: relative;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* Fallback for when no theme is applied */
.querychips-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  position: relative;
}

.querychips-themed .querychips-container:focus-within {
  border-color: var(--querychips-focus-border-color, #0969da);
  box-shadow: 0 0 0 3px var(--querychips-focus-shadow, rgba(9, 105, 218, 0.3));
  outline: none;
}

.querychips-themed .querychips-input-wrapper {
  flex: 1;
  min-width: 200px;
  position: relative;
  display: flex;
  align-items: center;
}

.querychips-themed .querychips-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.4;
  color: var(--querychips-text-color, #24292f);
  padding: 0;
  min-height: 24px;
  flex: 1;
}

.querychips-themed .querychips-input::placeholder {
  color: var(--querychips-placeholder-color, #656d76);
}

.querychips-themed .querychips-validation-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: 8px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.15s ease-in-out;
  flex-shrink: 0;
}

.querychips-themed .querychips-validation-icon.valid {
  background: var(--querychips-valid-bg, #ddf4d8);
  color: var(--querychips-valid-color, #1a7f37);
}

.querychips-themed .querychips-validation-icon.invalid {
  background: var(--querychips-invalid-bg, #ffebe9);
  color: var(--querychips-invalid-color, #cf222e);
}

.querychips-themed .querychips-validation-icon.incomplete {
  background: var(--querychips-incomplete-bg, #fff8c5);
  color: var(--querychips-incomplete-color, #9a6700);
}

.querychips-themed .querychips-validation-icon.empty {
  background: transparent;
  color: transparent;
}

.querychips-themed .querychips-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--querychips-tag-bg, #f6f8fa);
  border: 1px solid var(--querychips-tag-border, #d0d7de);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--querychips-tag-text, #24292f);
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  user-select: none;
}

.querychips-themed .querychips-tag:hover {
  background: var(--querychips-tag-hover-bg, #f0f3f6);
  border-color: var(--querychips-tag-hover-border, #8c959f);
}

.querychips-themed .querychips-tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  color: var(--querychips-tag-remove-color, #656d76);
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  font-size: 12px;
  line-height: 1;
}

.querychips-themed .querychips-tag-remove:hover {
  background: var(--querychips-tag-remove-hover-bg, #d0d7de);
  color: var(--querychips-tag-remove-hover-color, #24292f);
}

.querychips-themed .querychips-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--querychips-dropdown-bg, #ffffff);
  border: 1px solid var(--querychips-dropdown-border, #d0d7de);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.querychips-themed .querychips-dropdown-option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: var(--querychips-dropdown-text, #24292f);
}

.querychips-themed .querychips-dropdown-option:hover {
  background: var(--querychips-dropdown-hover-bg, #f6f8fa);
}

.querychips-themed .querychips-dropdown-option.selected {
  background: var(--querychips-dropdown-selected-bg, #0969da);
  color: var(--querychips-dropdown-selected-text, #ffffff);
}

.querychips-themed .querychips-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.querychips-themed .querychips-filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--querychips-filter-tag-bg, #ddf4d8);
  border: 1px solid var(--querychips-filter-tag-border, #1a7f37);
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--querychips-filter-tag-text, #1a7f37);
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  user-select: none;
}

.querychips-themed .querychips-filter-tag:hover {
  background: var(--querychips-filter-tag-hover-bg, #c8e6c9);
  border-color: var(--querychips-filter-tag-hover-border, #2da44e);
}

.querychips-themed .querychips-filter-tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  color: var(--querychips-filter-tag-remove-color, #1a7f37);
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  font-size: 12px;
  line-height: 1;
}

.querychips-themed .querychips-filter-tag-remove:hover {
  background: var(--querychips-filter-tag-remove-hover-bg, #2da44e);
  color: var(--querychips-filter-tag-remove-hover-color, #ffffff);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .querychips-themed .querychips-container {
    --querychips-text-color: #f0f6fc;
    --querychips-bg-color: #0d1117;
    --querychips-border-color: #30363d;
    --querychips-focus-border-color: #58a6ff;
    --querychips-focus-shadow: rgba(56, 139, 253, 0.4);
    --querychips-placeholder-color: #7d8590;
    --querychips-tag-bg: #21262d;
    --querychips-tag-border: #30363d;
    --querychips-tag-text: #f0f6fc;
    --querychips-tag-hover-bg: #30363d;
    --querychips-tag-hover-border: #7d8590;
    --querychips-tag-remove-color: #7d8590;
    --querychips-tag-remove-hover-bg: #30363d;
    --querychips-tag-remove-hover-color: #f0f6fc;
    --querychips-dropdown-bg: #0d1117;
    --querychips-dropdown-border: #30363d;
    --querychips-dropdown-text: #f0f6fc;
    --querychips-dropdown-hover-bg: #21262d;
    --querychips-dropdown-selected-bg: #58a6ff;
    --querychips-dropdown-selected-text: #0d1117;
    --querychips-filter-tag-bg: #1a7f37;
    --querychips-filter-tag-border: #2da44e;
    --querychips-filter-tag-text: #ffffff;
    --querychips-filter-tag-hover-bg: #2da44e;
    --querychips-filter-tag-hover-border: #3fb950;
    --querychips-filter-tag-remove-color: #ffffff;
    --querychips-filter-tag-remove-hover-bg: #3fb950;
    --querychips-filter-tag-remove-hover-color: #ffffff;
    --querychips-valid-bg: #1a7f37;
    --querychips-valid-color: #ffffff;
    --querychips-invalid-bg: #cf222e;
    --querychips-invalid-color: #ffffff;
    --querychips-incomplete-bg: #9a6700;
    --querychips-incomplete-color: #ffffff;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .querychips-container {
    padding: 6px 8px;
    min-height: 36px;
  }
  
  .querychips-input-wrapper {
    min-width: 150px;
  }
  
  .querychips-tag {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .querychips-filter-tag {
    font-size: 12px;
    padding: 4px 8px;
  }
}

/* Accessibility improvements */
.querychips-container:focus-within .querychips-input {
  outline: none;
}

.querychips-dropdown-option:focus {
  outline: 2px solid var(--querychips-focus-border-color, #0969da);
  outline-offset: -2px;
}

.querychips-tag-remove:focus,
.querychips-filter-tag-remove:focus {
  outline: 2px solid var(--querychips-focus-border-color, #0969da);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .querychips-container {
    border-width: 2px;
  }
  
  .querychips-tag,
  .querychips-filter-tag {
    border-width: 2px;
  }
  
  .querychips-dropdown {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .querychips-container,
  .querychips-tag,
  .querychips-dropdown-option,
  .querychips-filter-tag {
    transition: none;
  }
}
`;

// export const STYLES = ''
export function injectStyles(): void {
  if (document.getElementById('querychips-styles')) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = 'querychips-styles';
  styleElement.textContent = STYLES;
  document.head.appendChild(styleElement);
}
