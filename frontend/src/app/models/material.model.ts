export interface Material {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  issn?: string;
  publisher?: string;
  publicationYear?: number;
  edition?: string;
  category: string;
  subcategory?: string;
  location: string;
  status: MaterialStatus;
  type: MaterialType;
  numberOfPages?: number;
  language: string;
  description?: string;
  keywords?: string;
  assetNumber?: string;
  acquisitionValue?: number;
  acquisitionDate?: Date;
  supplier?: string;
  createdAt: Date;
  updatedAt: Date;
  typeIcon?: string;
}

export enum MaterialStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED'
}

export enum MaterialType {
  BOOK = 'BOOK',
  MAGAZINE = 'MAGAZINE',
  JOURNAL = 'JOURNAL',
  THESIS = 'THESIS',
  CD = 'CD',
  DVD = 'DVD',
  EBOOK = 'EBOOK',
  AUDIOBOOK = 'AUDIOBOOK',
  MAP = 'MAP',
  MANUSCRIPT = 'MANUSCRIPT'
}

export interface MaterialSearchParams {
  query?: string;
  category?: string;
  type?: MaterialType;
  author?: string;
  publisher?: string;
  publicationYear?: number;
  status?: MaterialStatus;
  isbn?: string;
  language?: string;
  location?: string;
  keywords?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'author' | 'publicationYear' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface MaterialSearchResponse {
  materials: Material[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MaterialCategory {
  name: string;
  count: number;
}

export interface MaterialTypeInfo {
  type: MaterialType;
  name: string;
  icon: string;
  count: number;
}

