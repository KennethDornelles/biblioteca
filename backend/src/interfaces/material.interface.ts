import { MaterialStatus, MaterialType } from '../enums';

export interface IMaterial {
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
}

export interface ICreateMaterial {
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
  type: MaterialType;
  numberOfPages?: number;
  language?: string;
  description?: string;
  keywords?: string;
  assetNumber?: string;
  acquisitionValue?: number;
  acquisitionDate?: Date;
  supplier?: string;
}

export interface IUpdateMaterial {
  title?: string;
  author?: string;
  isbn?: string;
  issn?: string;
  publisher?: string;
  publicationYear?: number;
  edition?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  status?: MaterialStatus;
  type?: MaterialType;
  numberOfPages?: number;
  language?: string;
  description?: string;
  keywords?: string;
  assetNumber?: string;
  acquisitionValue?: number;
  acquisitionDate?: Date;
  supplier?: string;
}

export interface IMaterialFilters {
  title?: string;
  author?: string;
  isbn?: string;
  category?: string;
  subcategory?: string;
  status?: MaterialStatus;
  type?: MaterialType;
  language?: string;
  location?: string;
  publicationYear?: number;
  publisher?: string;
  assetNumber?: string;
  available?: boolean;
}

export interface IMaterialSearchParams {
  query?: string;
  filters?: IMaterialFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IMaterialResponse {
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
  statusLabel: string;
  statusColor: string;
  typeLabel: string;
  typeIcon: string;
}

export interface IPaginatedMaterials {
  materials: IMaterialResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IMaterialStatistics {
  total: number;
  available: number;
  loaned: number;
  reserved: number;
  maintenance: number;
  lost: number;
  decommissioned: number;
  byType: Record<MaterialType, number>;
  byCategory: Record<string, number>;
  byLanguage: Record<string, number>;
}
