import { MaterialStatus, MaterialType } from '../enums';
import { IMaterial, ICreateMaterial, IUpdateMaterial, IMaterialFilters, IMaterialSearchParams, IMaterialResponse, IPaginatedMaterials, IMaterialStatistics } from '../interfaces';

// Tipos de entrada para criação e atualização
export type CreateMaterialInput = ICreateMaterial;
export type UpdateMaterialInput = IUpdateMaterial;

// Tipos de filtros e busca
export type MaterialFilters = IMaterialFilters;
export type MaterialSearchParams = IMaterialSearchParams;

// Tipos de resposta
export type MaterialResponse = IMaterialResponse;
export type PaginatedMaterials = IPaginatedMaterials;
export type MaterialStatistics = IMaterialStatistics;

// Tipos de validação
export type MaterialValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

// Tipos de operações
export type MaterialOperation = 'create' | 'update' | 'delete' | 'status_change' | 'location_change';

// Tipos de eventos
export type MaterialEvent = {
  operation: MaterialOperation;
  materialId: string;
  userId: string;
  timestamp: Date;
  details: Record<string, any>;
};

// Tipos de relatórios
export type MaterialReport = {
  period: {
    start: Date;
    end: Date;
  };
  statistics: MaterialStatistics;
  topMaterials: Array<{
    material: MaterialResponse;
    loanCount: number;
    reservationCount: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  typeBreakdown: Array<{
    type: MaterialType;
    count: number;
    percentage: number;
  }>;
};

// Tipos de importação/exportação
export type MaterialImportData = Omit<ICreateMaterial, 'id' | 'createdAt' | 'updatedAt'> & {
  externalId?: string;
  batchId?: string;
};

export type MaterialExportFormat = 'csv' | 'json' | 'xml' | 'pdf';

export type MaterialExportOptions = {
  format: MaterialExportFormat;
  includeDetails: boolean;
  filters?: MaterialFilters;
  dateRange?: {
    start: Date;
    end: Date;
  };
};

// Tipos de auditoria
export type MaterialAuditLog = {
  id: string;
  materialId: string;
  userId: string;
  action: string;
  timestamp: Date;
  oldValues?: Partial<IMaterial>;
  newValues?: Partial<IMaterial>;
  ipAddress?: string;
  userAgent?: string;
};

// Tipos de configuração
export type MaterialConfig = {
  maxTitleLength: number;
  maxAuthorLength: number;
  maxDescriptionLength: number;
  allowedFileTypes: string[];
  maxFileSize: number;
  defaultLanguage: string;
  defaultLocation: string;
  statusTransitions: Record<MaterialStatus, MaterialStatus[]>;
  typeConfigurations: Record<MaterialType, {
    maxLoanDays: number;
    maxRenewals: number;
    canReserve: boolean;
    reservationExpiryDays: number;
  }>;
};
