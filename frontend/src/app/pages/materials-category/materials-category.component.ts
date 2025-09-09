import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MaterialService } from '../../services/material.service';
import { Material, MaterialSearchResponse, MaterialType, MaterialStatus } from '../../models/material.model';

@Component({
  selector: 'app-materials-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materials-category.component.html',
  styleUrl: './materials-category.component.scss'
})
export class MaterialsCategoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Dados da categoria
  categoryName: string = '';
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

  // Estados da UI
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private materialService: MaterialService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
        this.categoryName = params['category'];
        if (this.categoryName) {
          this.loadMaterialsByCategory();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadMaterialsByCategory(): void {
    this.loading = true;
    this.error = null;

    this.materialService.getMaterialsByCategory(this.categoryName, this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.materials = response.materials;
          this.totalMaterials = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Erro ao carregar materiais da categoria.';
          this.loading = false;
          console.error('Erro ao carregar materiais por categoria:', error);
        }
      });
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.loadMaterialsByCategory();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMaterialsByCategory();
  }

  onViewModeChange(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  goBack(): void {
    this.router.navigate(['/materials']);
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }

  goToMaterial(materialId: string): void {
    this.router.navigate(['/material', materialId]);
  }

  goToType(type: string): void {
    this.router.navigate(['/materials/type', type]);
  }

  getStatusText(status: MaterialStatus): string {
    const statusMap: Record<MaterialStatus, string> = {
      [MaterialStatus.AVAILABLE]: 'Disponível',
      [MaterialStatus.LOANED]: 'Emprestado',
      [MaterialStatus.RESERVED]: 'Reservado',
      [MaterialStatus.MAINTENANCE]: 'Manutenção',
      [MaterialStatus.LOST]: 'Perdido',
      [MaterialStatus.DECOMMISSIONED]: 'Descomissionado'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: MaterialStatus): string {
    const classMap: Record<MaterialStatus, string> = {
      [MaterialStatus.AVAILABLE]: 'status-available',
      [MaterialStatus.LOANED]: 'status-borrowed',
      [MaterialStatus.RESERVED]: 'status-reserved',
      [MaterialStatus.MAINTENANCE]: 'status-maintenance',
      [MaterialStatus.LOST]: 'status-lost',
      [MaterialStatus.DECOMMISSIONED]: 'status-decommissioned'
    };
    return classMap[status] || '';
  }

  getTypeText(type: MaterialType): string {
    const typeMap: Record<MaterialType, string> = {
      [MaterialType.BOOK]: 'Livro',
      [MaterialType.MAGAZINE]: 'Revista',
      [MaterialType.JOURNAL]: 'Periódico',
      [MaterialType.THESIS]: 'Tese',
      [MaterialType.CD]: 'CD',
      [MaterialType.DVD]: 'DVD',
      [MaterialType.MAP]: 'Mapa',
      [MaterialType.DISSERTATION]: 'Dissertação',
      [MaterialType.MONOGRAPH]: 'Monografia',
      [MaterialType.ARTICLE]: 'Artigo',
      [MaterialType.OTHER]: 'Outro'
    };
    return typeMap[type] || type;
  }

  getTypeIcon(type: MaterialType): string {
    const iconMap: Record<MaterialType, string> = {
      [MaterialType.BOOK]: '📚',
      [MaterialType.MAGAZINE]: '📰',
      [MaterialType.JOURNAL]: '📄',
      [MaterialType.THESIS]: '🎓',
      [MaterialType.CD]: '💿',
      [MaterialType.DVD]: '💿',
      [MaterialType.MAP]: '🗺️',
      [MaterialType.DISSERTATION]: '🎓',
      [MaterialType.MONOGRAPH]: '📖',
      [MaterialType.ARTICLE]: '📄',
      [MaterialType.OTHER]: '📁'
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