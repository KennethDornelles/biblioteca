import { MaterialResponseDto } from './material-response.dto';

export class SearchResultDto {
  materials: MaterialResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  query?: string;
  filters?: Record<string, any>;
  searchTime: number; // Tempo de busca em ms
}

