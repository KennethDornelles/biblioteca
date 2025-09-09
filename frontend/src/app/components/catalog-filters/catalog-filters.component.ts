import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MaterialService } from '../../services/material.service';
import { MaterialCategory, MaterialTypeInfo, MaterialType, MaterialStatus } from '../../models/material.model';

export interface CatalogFilters {
  query?: string;
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
  categories?: string[];
  types?: MaterialType[];
  authors?: string[];
  publishers?: string[];
  minYear?: number;
  maxYear?: number;
  hasReviews?: boolean;
  minRating?: number;
}

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog-filters.component.html',
  styleUrl: './catalog-filters.component.scss'
})
export class CatalogFiltersComponent implements OnInit, OnDestroy {
  @Input() filters: CatalogFilters = {};
  @Output() filtersChange = new EventEmitter<CatalogFilters>();
  @Output() applyFilters = new EventEmitter<CatalogFilters>();
  @Output() clearFilters = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  // Opções de filtro
  categories: MaterialCategory[] = [];
  subcategories: { subcategory: string; count: number }[] = [];
  materialTypes: MaterialTypeInfo[] = [];
  authors: string[] = [];
  publishers: string[] = [];

  // Estados da UI
  showAdvancedFilters = false;
  loading = false;

  // Opções de status
  statusOptions = [
    { value: MaterialStatus.AVAILABLE, label: 'Disponível' },
    { value: MaterialStatus.LOANED, label: 'Emprestado' },
    { value: MaterialStatus.RESERVED, label: 'Reservado' },
    { value: MaterialStatus.MAINTENANCE, label: 'Em Manutenção' },
    { value: MaterialStatus.LOST, label: 'Perdido' },
    { value: MaterialStatus.DECOMMISSIONED, label: 'Desativado' }
  ];

  // Opções de idioma
  languageOptions = [
    'Português',
    'Inglês',
    'Espanhol',
    'Francês',
    'Alemão',
    'Italiano',
    'Outro'
  ];

  constructor(
    private materialService: MaterialService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFilterOptions();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFilterOptions(): void {
    this.loading = true;

    // Carregar categorias
    this.materialService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar categorias:', error);
          this.loading = false;
        }
      });

    // Carregar tipos de materiais
    this.materialService.getMaterialTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types) => this.materialTypes = types,
        error: (error) => console.error('Erro ao carregar tipos:', error)
      });
  }

  onCategoryChange(): void {
    if (this.filters.category) {
      this.materialService.getSubcategories(this.filters.category)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (subcategories) => this.subcategories = subcategories,
          error: (error) => console.error('Erro ao carregar subcategorias:', error)
        });
    } else {
      this.subcategories = [];
      this.filters.subcategory = undefined;
    }
    this.emitFiltersChange();
  }

  onFiltersChange(): void {
    this.emitFiltersChange();
  }

  private emitFiltersChange(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  onApplyFilters(): void {
    this.applyFilters.emit({ ...this.filters });
  }

  onClearFilters(): void {
    this.filters = {};
    this.subcategories = [];
    this.emitFiltersChange();
    this.clearFilters.emit();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  getStatusText(status: MaterialStatus): string {
    const statusMap: Record<MaterialStatus, string> = {
      [MaterialStatus.AVAILABLE]: 'Disponível',
      [MaterialStatus.LOANED]: 'Emprestado',
      [MaterialStatus.RESERVED]: 'Reservado',
      [MaterialStatus.MAINTENANCE]: 'Em Manutenção',
      [MaterialStatus.LOST]: 'Perdido',
      [MaterialStatus.DECOMMISSIONED]: 'Desativado'
    };
    return statusMap[status] || status;
  }

  getTypeText(type: MaterialType): string {
    const typeMap: Record<MaterialType, string> = {
      [MaterialType.BOOK]: 'Livro',
      [MaterialType.MAGAZINE]: 'Revista',
      [MaterialType.JOURNAL]: 'Periódico',
      [MaterialType.DVD]: 'DVD',
      [MaterialType.CD]: 'CD',
      [MaterialType.THESIS]: 'Tese',
      [MaterialType.DISSERTATION]: 'Dissertação',
      [MaterialType.MONOGRAPH]: 'Monografia',
      [MaterialType.ARTICLE]: 'Artigo',
      [MaterialType.MAP]: 'Mapa',
      [MaterialType.OTHER]: 'Outro'
    };
    return typeMap[type] || type;
  }

  getTypeIcon(type: MaterialType): string {
    const iconMap: Record<MaterialType, string> = {
      [MaterialType.BOOK]: '📚',
      [MaterialType.MAGAZINE]: '📰',
      [MaterialType.JOURNAL]: '📄',
      [MaterialType.DVD]: '💿',
      [MaterialType.CD]: '💿',
      [MaterialType.THESIS]: '🎓',
      [MaterialType.DISSERTATION]: '🎓',
      [MaterialType.MONOGRAPH]: '📖',
      [MaterialType.ARTICLE]: '📄',
      [MaterialType.MAP]: '🗺️',
      [MaterialType.OTHER]: '📁'
    };
    return iconMap[type] || '📁';
  }
}
