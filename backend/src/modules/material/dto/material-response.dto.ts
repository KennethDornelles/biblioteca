import { MaterialStatus, MaterialType } from '../../../enums';

export class MaterialResponseDto {
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

