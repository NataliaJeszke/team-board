export interface FilterOption {
  label: string;
  value: number | string;
}

export interface FilterConfig {
  key: string;
  type: 'select' | 'date';
  options?: readonly FilterOption[];
  placeholder?: string;
  width?: string;
  defaultValue?: string | number | null;
}

export type FilterValues = Record<string, string | number | null>;
