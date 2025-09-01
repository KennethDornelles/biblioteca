import { MaterialResponseDto } from './material-response.dto';

export class PaginatedMaterialsDto {
  materials: MaterialResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

