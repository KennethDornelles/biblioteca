import { MaterialStatus, MaterialType, MATERIAL_STATUS_LABELS, MATERIAL_STATUS_COLORS, MATERIAL_TYPE_LABELS, MATERIAL_TYPE_ICONS } from '../enums';
import { IMaterial, IMaterialResponse, IMaterialFilters, IMaterialSearchParams, IMaterialStatistics } from '../interfaces';
import { MATERIAL_VALIDATION_CONSTRAINTS, MATERIAL_TYPE_CONFIGURATIONS } from '../constants';

/**
 * Valida um material antes de salvar
 */
export function validateMaterial(material: Partial<IMaterial>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validação do título
  if (material.title) {
    if (material.title.length < MATERIAL_VALIDATION_CONSTRAINTS.TITLE.MIN_LENGTH) {
      errors.push(`Título deve ter pelo menos ${MATERIAL_VALIDATION_CONSTRAINTS.TITLE.MIN_LENGTH} caracteres`);
    }
    if (material.title.length > MATERIAL_VALIDATION_CONSTRAINTS.TITLE.MAX_LENGTH) {
      errors.push(`Título deve ter no máximo ${MATERIAL_VALIDATION_CONSTRAINTS.TITLE.MAX_LENGTH} caracteres`);
    }
  } else {
    errors.push('Título é obrigatório');
  }

  // Validação do autor
  if (material.author) {
    if (material.author.length < MATERIAL_VALIDATION_CONSTRAINTS.AUTHOR.MIN_LENGTH) {
      errors.push(`Autor deve ter pelo menos ${MATERIAL_VALIDATION_CONSTRAINTS.AUTHOR.MIN_LENGTH} caracteres`);
    }
    if (material.author.length > MATERIAL_VALIDATION_CONSTRAINTS.AUTHOR.MAX_LENGTH) {
      errors.push(`Autor deve ter no máximo ${MATERIAL_VALIDATION_CONSTRAINTS.AUTHOR.MAX_LENGTH} caracteres`);
    }
  } else {
    errors.push('Autor é obrigatório');
  }

  // Validação do ISBN
  if (material.isbn && !MATERIAL_VALIDATION_CONSTRAINTS.ISBN.PATTERN.test(material.isbn)) {
    errors.push('ISBN deve ter formato válido (10 ou 13 dígitos)');
  }

  // Validação do ISSN
  if (material.issn && !MATERIAL_VALIDATION_CONSTRAINTS.ISSN.PATTERN.test(material.issn)) {
    errors.push('ISSN deve ter formato válido (XXXX-XXXX)');
  }

  // Validação do ano de publicação
  if (material.publicationYear) {
    if (material.publicationYear < MATERIAL_VALIDATION_CONSTRAINTS.PUBLICATION_YEAR.MIN) {
      errors.push(`Ano de publicação deve ser maior que ${MATERIAL_VALIDATION_CONSTRAINTS.PUBLICATION_YEAR.MIN}`);
    }
    if (material.publicationYear > MATERIAL_VALIDATION_CONSTRAINTS.PUBLICATION_YEAR.MAX) {
      errors.push(`Ano de publicação não pode ser maior que ${MATERIAL_VALIDATION_CONSTRAINTS.PUBLICATION_YEAR.MAX}`);
    }
  }

  // Validação do número de páginas
  if (material.numberOfPages) {
    if (material.numberOfPages < MATERIAL_VALIDATION_CONSTRAINTS.NUMBER_OF_PAGES.MIN) {
      errors.push(`Número de páginas deve ser maior que ${MATERIAL_VALIDATION_CONSTRAINTS.NUMBER_OF_PAGES.MIN}`);
    }
    if (material.numberOfPages > MATERIAL_VALIDATION_CONSTRAINTS.NUMBER_OF_PAGES.MAX) {
      errors.push(`Número de páginas deve ser menor que ${MATERIAL_VALIDATION_CONSTRAINTS.NUMBER_OF_PAGES.MAX}`);
    }
  }

  // Validação do valor de aquisição
  if (material.acquisitionValue !== undefined) {
    if (material.acquisitionValue < MATERIAL_VALIDATION_CONSTRAINTS.ACQUISITION_VALUE.MIN) {
      errors.push(`Valor de aquisição deve ser maior que ${MATERIAL_VALIDATION_CONSTRAINTS.ACQUISITION_VALUE.MIN}`);
    }
    if (material.acquisitionValue > MATERIAL_VALIDATION_CONSTRAINTS.ACQUISITION_VALUE.MAX) {
      errors.push(`Valor de aquisição deve ser menor que ${MATERIAL_VALIDATION_CONSTRAINTS.ACQUISITION_VALUE.MAX}`);
    }
  }

  // Validação da categoria
  if (material.category) {
    if (material.category.length < MATERIAL_VALIDATION_CONSTRAINTS.CATEGORY.MIN_LENGTH) {
      errors.push(`Categoria deve ter pelo menos ${MATERIAL_VALIDATION_CONSTRAINTS.CATEGORY.MIN_LENGTH} caracteres`);
    }
    if (material.category.length > MATERIAL_VALIDATION_CONSTRAINTS.CATEGORY.MAX_LENGTH) {
      errors.push(`Categoria deve ter no máximo ${MATERIAL_VALIDATION_CONSTRAINTS.CATEGORY.MAX_LENGTH} caracteres`);
    }
  } else {
    errors.push('Categoria é obrigatória');
  }

  // Validação da localização
  if (material.location) {
    if (material.location.length < MATERIAL_VALIDATION_CONSTRAINTS.LOCATION.MIN_LENGTH) {
      errors.push(`Localização deve ter pelo menos ${MATERIAL_VALIDATION_CONSTRAINTS.LOCATION.MIN_LENGTH} caracteres`);
    }
    if (material.location.length > MATERIAL_VALIDATION_CONSTRAINTS.LOCATION.MAX_LENGTH) {
      errors.push(`Localização deve ter no máximo ${MATERIAL_VALIDATION_CONSTRAINTS.LOCATION.MAX_LENGTH} caracteres`);
    }
  } else {
    errors.push('Localização é obrigatória');
  }

  // Avisos
  if (!material.description) {
    warnings.push('Descrição é recomendada para melhor identificação do material');
  }

  if (!material.keywords) {
    warnings.push('Palavras-chave são recomendadas para facilitar a busca');
  }

  if (!material.assetNumber) {
    warnings.push('Número de patrimônio é recomendado para controle interno');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Converte um material para resposta formatada
 */
export function formatMaterialResponse(material: IMaterial): IMaterialResponse {
  return {
    ...material,
    statusLabel: MATERIAL_STATUS_LABELS[material.status],
    statusColor: MATERIAL_STATUS_COLORS[material.status],
    typeLabel: MATERIAL_TYPE_LABELS[material.type],
    typeIcon: MATERIAL_TYPE_ICONS[material.type],
  };
}

/**
 * Aplica filtros a uma lista de materiais
 */
export function filterMaterials(materials: IMaterial[], filters: IMaterialFilters): IMaterial[] {
  return materials.filter(material => {
    if (filters.title && !material.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }

    if (filters.author && !material.author.toLowerCase().includes(filters.author.toLowerCase())) {
      return false;
    }

    if (filters.isbn && material.isbn !== filters.isbn) {
      return false;
    }

    if (filters.category && material.category !== filters.category) {
      return false;
    }

    if (filters.subcategory && material.subcategory !== filters.subcategory) {
      return false;
    }

    if (filters.status && material.status !== filters.status) {
      return false;
    }

    if (filters.type && material.type !== filters.type) {
      return false;
    }

    if (filters.language && material.language !== filters.language) {
      return false;
    }

    if (filters.location && material.location !== filters.location) {
      return false;
    }

    if (filters.publicationYear && material.publicationYear !== filters.publicationYear) {
      return false;
    }

    if (filters.publisher && material.publisher !== filters.publisher) {
      return false;
    }

    if (filters.assetNumber && material.assetNumber !== filters.assetNumber) {
      return false;
    }

    if (filters.available !== undefined) {
      const isAvailable = material.status === MaterialStatus.AVAILABLE;
      if (filters.available !== isAvailable) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Aplica parâmetros de busca e ordenação
 */
export function applyMaterialSearchParams(
  materials: IMaterial[],
  params: IMaterialSearchParams
): { materials: IMaterial[]; total: number } {
  let filteredMaterials = materials;

  // Aplicar filtros
  if (params.filters) {
    filteredMaterials = filterMaterials(materials, params.filters);
  }

  // Aplicar busca por texto
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredMaterials = filteredMaterials.filter(material =>
      material.title.toLowerCase().includes(query) ||
      material.author.toLowerCase().includes(query) ||
      (material.description && material.description.toLowerCase().includes(query)) ||
      (material.keywords && material.keywords.toLowerCase().includes(query)) ||
      (material.isbn && material.isbn.includes(query)) ||
      (material.assetNumber && material.assetNumber.includes(query))
    );
  }

  // Aplicar ordenação
  if (params.sortBy && params.sortOrder) {
    filteredMaterials.sort((a, b) => {
      const aValue = a[params.sortBy as keyof IMaterial];
      const bValue = b[params.sortBy as keyof IMaterial];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return params.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return params.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return params.sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return 0;
    });
  }

  return {
    materials: filteredMaterials,
    total: filteredMaterials.length,
  };
}

/**
 * Aplica paginação aos resultados
 */
export function paginateMaterials(
  materials: IMaterial[],
  page: number = 1,
  limit: number = 20
): { materials: IMaterial[]; total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrev: boolean } {
  const total = materials.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMaterials = materials.slice(startIndex, endIndex);

  return {
    materials: paginatedMaterials,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Calcula estatísticas dos materiais
 */
export function calculateMaterialStatistics(materials: IMaterial[]): IMaterialStatistics {
  const total = materials.length;
  const byStatus = materials.reduce((acc, material) => {
    acc[material.status] = (acc[material.status] || 0) + 1;
    return acc;
  }, {} as Record<MaterialStatus, number>);

  const byType = materials.reduce((acc, material) => {
    acc[material.type] = (acc[material.type] || 0) + 1;
    return acc;
  }, {} as Record<MaterialType, number>);

  const byCategory = materials.reduce((acc, material) => {
    acc[material.category] = (acc[material.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byLanguage = materials.reduce((acc, material) => {
    acc[material.language] = (acc[material.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    available: byStatus[MaterialStatus.AVAILABLE] || 0,
    loaned: byStatus[MaterialStatus.LOANED] || 0,
    reserved: byStatus[MaterialStatus.RESERVED] || 0,
    maintenance: byStatus[MaterialStatus.MAINTENANCE] || 0,
    lost: byStatus[MaterialStatus.LOST] || 0,
    decommissioned: byStatus[MaterialStatus.DECOMMISSIONED] || 0,
    byType,
    byCategory,
    byLanguage,
  };
}

/**
 * Verifica se um material pode ser emprestado
 */
export function canMaterialBeLoaned(material: IMaterial): boolean {
  return material.status === MaterialStatus.AVAILABLE;
}

/**
 * Verifica se um material pode ser reservado
 */
export function canMaterialBeReserved(material: IMaterial): boolean {
  const config = MATERIAL_TYPE_CONFIGURATIONS[material.type];
  return config.canReserve && material.status === MaterialStatus.AVAILABLE;
}

/**
 * Obtém a configuração de empréstimo para um tipo de material
 */
export function getMaterialLoanConfig(materialType: MaterialType) {
  return MATERIAL_TYPE_CONFIGURATIONS[materialType];
}

/**
 * Gera um número de patrimônio único
 */
export function generateAssetNumber(prefix: string = 'MAT'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Formata o valor de aquisição para exibição
 */
export function formatAcquisitionValue(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Calcula a idade do material em anos
 */
export function calculateMaterialAge(publicationYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - publicationYear;
}

/**
 * Verifica se um material está em bom estado baseado na idade
 */
export function isMaterialInGoodCondition(publicationYear: number, maxAge: number = 10): boolean {
  const age = calculateMaterialAge(publicationYear);
  return age <= maxAge;
}

