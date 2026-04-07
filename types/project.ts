export interface GeneratedSite {
  html: string;
  css: string;
  title: string;
  description: string;
  pages: string[];
}

export interface GenerateRequest {
  sector: string;
  businessName: string;
  description: string;
  colorPalette?: string;
  pages?: string[];
}

export interface PublishRequest {
  projectId: string;
  editorHtml: string;
  editorCss: string;
  title: string;
  description: string;
}

export interface PublishResponse {
  success: boolean;
  siteUrl: string;
  message: string;
}

export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
