import type { ReactNode } from "react";

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface CodeExample {
  title: string;
  description?: string;
  language?: DocsCodeLanguage;
  code: string;
}

export type DocsCodeLanguage = "tsx" | "ts" | "css" | "bash";

export interface ComponentDoc {
  category: string;
  description: string;
  examples: CodeExample[];
  features: string[];
  importExample: string;
  name: string;
  options: string[];
  preview: ReactNode;
  props: PropDoc[];
  summary: string;
}
