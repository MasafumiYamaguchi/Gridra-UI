import type { ReactNode } from "react";

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
  group?: string;
  values?: string[];
}

export interface CodeExample {
  title: string;
  description?: string;
  language?: DocsCodeLanguage;
  code: string;
  preview?: ReactNode;
}

export type DocsCodeLanguage = "tsx" | "ts" | "css" | "bash";

export interface ComponentDoc {
  accessibility?: string;
  avoid?: string;
  category: string;
  compositions?: string[];
  description: string;
  examples: CodeExample[];
  features: string[];
  importExample: string;
  name: string;
  notes?: string;
  options: string[];
  preview: ReactNode;
  previewCode?: string;
  props: PropDoc[];
  propsDescription?: string;
  states?: CodeExample[];
  summary: string;
  usage?: string;
}
