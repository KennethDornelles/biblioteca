import { MaterialStatus, MaterialType } from '../../enums';

export class Material {
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

  constructor(data: Partial<Material>) {
    Object.assign(this, data);
  }

  static create(data: Partial<Material>): Material {
    return new Material(data);
  }

  update(data: Partial<Material>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  changeStatus(newStatus: MaterialStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  changeLocation(newLocation: string): void {
    this.location = newLocation;
    this.updatedAt = new Date();
  }

  isAvailable(): boolean {
    return this.status === MaterialStatus.AVAILABLE;
  }

  canBeLoaned(): boolean {
    return this.status === MaterialStatus.AVAILABLE;
  }

  canBeReserved(): boolean {
    return this.status === MaterialStatus.AVAILABLE;
  }

  isOverdue(): boolean {
    return this.status === MaterialStatus.LOANED;
  }

  isMaintenance(): boolean {
    return this.status === MaterialStatus.MAINTENANCE;
  }

  isLost(): boolean {
    return this.status === MaterialStatus.LOST;
  }

  isDecommissioned(): boolean {
    return this.status === MaterialStatus.DECOMMISSIONED;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      issn: this.issn,
      publisher: this.publisher,
      publicationYear: this.publicationYear,
      edition: this.edition,
      category: this.category,
      subcategory: this.subcategory,
      location: this.location,
      status: this.status,
      type: this.type,
      numberOfPages: this.numberOfPages,
      language: this.language,
      description: this.description,
      keywords: this.keywords,
      assetNumber: this.assetNumber,
      acquisitionValue: this.acquisitionValue,
      acquisitionDate: this.acquisitionDate,
      supplier: this.supplier,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

