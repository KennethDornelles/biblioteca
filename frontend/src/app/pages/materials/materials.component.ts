import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MaterialService } from '../../services/material.service';
import { Material, MaterialSearchResponse, MaterialCategory, MaterialTypeInfo, MaterialType, MaterialStatus } from '../../models/material.model';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss'
})
export class MaterialsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Dados do catálogo
  materials: Material[] = [];
  totalMaterials = 0;
  currentPage = 1;
  totalPages = 0;
  itemsPerPage = 20;
  loading = false;
  error: string | null = null;

  // Filtros e ordenação
  sortBy = 'title';
  sortOrder = 'asc';

  // Opções de filtro
  categories: MaterialCategory[] = [];
  materialTypes: MaterialTypeInfo[] = [];

  // Estados da UI
  viewMode: 'grid' | 'list' = 'grid';
  showFilters = false;

  constructor(
    private materialService: MaterialService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFilterOptions();
      this.loadMaterials();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFilterOptions(): void {
    // Carregar categorias
    this.materialService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => this.categories = categories,
        error: (error) => console.error('Erro ao carregar categorias:', error)
      });

    // Carregar tipos de materiais
    this.materialService.getMaterialTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types) => this.materialTypes = types,
        error: (error) => console.error('Erro ao carregar tipos:', error)
      });
  }

  public loadMaterials(): void {
    this.loading = true;
    this.error = null;

    this.materialService.getAllMaterials(this.currentPage, this.itemsPerPage, this.sortBy, this.sortOrder)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.materials = response.materials;
          this.totalMaterials = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Erro ao carregar catálogo. Tente novamente.';
          this.loading = false;
          console.error('Erro ao carregar materiais:', error);
        }
      });
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.loadMaterials();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMaterials();
  }

  onViewModeChange(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  goToMaterial(materialId: string): void {
    this.router.navigate(['/material', materialId]);
  }

  goToCategory(category: string): void {
    this.router.navigate(['/materials/category', category]);
  }

  goToType(type: string): void {
    this.router.navigate(['/materials/type', type]);
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }

  getStatusText(status: MaterialStatus): string {
    const statusMap = {
      [MaterialStatus.AVAILABLE]: 'Disponível',
      [MaterialStatus.BORROWED]: 'Emprestado',
      [MaterialStatus.RESERVED]: 'Reservado',
      [MaterialStatus.MAINTENANCE]: 'Manutenção',
      [MaterialStatus.LOST]: 'Perdido',
      [MaterialStatus.DAMAGED]: 'Danificado'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: MaterialStatus): string {
    const classMap = {
      [MaterialStatus.AVAILABLE]: 'status-available',
      [MaterialStatus.BORROWED]: 'status-borrowed',
      [MaterialStatus.RESERVED]: 'status-reserved',
      [MaterialStatus.MAINTENANCE]: 'status-maintenance',
      [MaterialStatus.LOST]: 'status-lost',
      [MaterialStatus.DAMAGED]: 'status-damaged'
    };
    return classMap[status] || '';
  }

  getTypeText(type: MaterialType): string {
    const typeMap = {
      [MaterialType.BOOK]: 'Livro',
      [MaterialType.MAGAZINE]: 'Revista',
      [MaterialType.JOURNAL]: 'Periódico',
      [MaterialType.THESIS]: 'Tese',
      [MaterialType.CD]: 'CD',
      [MaterialType.DVD]: 'DVD',
      [MaterialType.EBOOK]: 'E-book',
      [MaterialType.AUDIOBOOK]: 'Audiobook',
      [MaterialType.MAP]: 'Mapa',
      [MaterialType.MANUSCRIPT]: 'Manuscrito'
    };
    return typeMap[type] || type;
  }

  getTypeIcon(type: MaterialType): string {
    const iconMap = {
      [MaterialType.BOOK]: '📚',
      [MaterialType.MAGAZINE]: '📰',
      [MaterialType.JOURNAL]: '📄',
      [MaterialType.THESIS]: '🎓',
      [MaterialType.CD]: '💿',
      [MaterialType.DVD]: '💿',
      [MaterialType.EBOOK]: '📱',
      [MaterialType.AUDIOBOOK]: '🎧',
      [MaterialType.MAP]: '🗺️',
      [MaterialType.MANUSCRIPT]: '📜'
    };
    return iconMap[type] || '📄';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}