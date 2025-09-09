export class CatalogStatisticsDto {
  overview: {
    totalMaterials: number;
    availableMaterials: number;
    loanedMaterials: number;
    reservedMaterials: number;
    maintenanceMaterials: number;
    recentMaterials: number;
  };
  
  distribution: {
    byType: Array<{
      type: string;
      count: number;
      label: string;
      icon: string;
    }>;
    byCategory: Array<{
      category: string;
      count: number;
    }>;
  };
  
  topLists: {
    authors: Array<{
      author: string;
      count: number;
    }>;
    publishers: Array<{
      publisher: string;
      count: number;
    }>;
  };
  
  generatedAt: string;
}
