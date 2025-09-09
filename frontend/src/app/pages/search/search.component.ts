import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil, switchMap, of } from 'rxjs';
import { MaterialService } from '../../services/material.service';
import { Material, MaterialSearchParams, MaterialSearchResponse, MaterialCategory, MaterialTypeInfo, MaterialType, MaterialStatus } from '../../models/material.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Dados da busca
  searchResults: Material[] = [];
  totalResults = 0;
  currentPage = 1;
  totalPages = 0;
  itemsPerPage = 20;
  loading = false;
  error: string | null = null;
  searchTime = 0;

  // Filtros
  searchQuery = '';
  selectedCategory = '';
  selectedType: MaterialType | '' = '';
  selectedStatus: MaterialStatus | '' = '';
  sortBy = 'title';
  sortOrder = 'asc';

  // Opções de filtro
  categories: MaterialCategory[] = [];
  materialTypes: MaterialTypeInfo[] = [];

  // Estados da UI
  showFilters = false;
  showAdvancedSearch = false;

  // Busca avançada
  advancedSearch = {
    author: '',
    publisher: '',
    isbn: '',
    publicationYear: null as number | null,
    language: '',
    location: '',
    keywords: '',
    startDate: '',
    endDate: ''
  };

  constructor(
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFilterOptions();
      this.setupSearchSubscription();
      this.loadInitialSearch();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap(query => {
          if (query.trim()) {
            this.loading = true;
            this.error = null;
            return this.performSearch();
          } else {
            this.searchResults = [];
            this.totalResults = 0;
            this.loading = false;
            return of(null);
          }
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.searchResults = response.materials;
            this.totalResults = response.total;
            this.totalPages = response.totalPages;
            this.searchTime = response.searchTime;
            console.log(`Busca realizada em ${response.searchTime}ms`);
          }
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Erro ao buscar materiais. Tente novamente.';
          this.loading = false;
          console.error('Erro na busca automática:', error);
        }
      });
  }

  private loadInitialSearch(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.performSearch().subscribe({
          next: (response: any) => {
            if (response) {
              this.searchResults = response.materials;
              this.totalResults = response.total;
              this.totalPages = response.totalPages;
              this.searchTime = response.searchTime;
            }
            this.loading = false;
          },
          error: (error: any) => {
            this.error = 'Erro ao carregar busca inicial.';
            this.loading = false;
            console.error('Erro na busca inicial:', error);
          }
        });
      }
    });
  }

  private loadFilterOptions(): void {
    // Carregar categorias
    this.materialService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => this.categories = categories,
        error: (error: any) => console.error('Erro ao carregar categorias:', error)
      });

    // Carregar tipos de materiais
    this.materialService.getMaterialTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types) => this.materialTypes = types,
        error: (error: any) => console.error('Erro ao carregar tipos:', error)
      });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSearchSubmit(): void {
    this.currentPage = 1;
    this.performSearch().subscribe({
      next: (response: any) => {
        if (response) {
          this.searchResults = response.materials;
          this.totalResults = response.total;
          this.totalPages = response.totalPages;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erro ao buscar materiais. Tente novamente.';
        this.loading = false;
        console.error('Erro na busca:', error);
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.performSearch().subscribe({
      next: (response: any) => {
        if (response) {
          this.searchResults = response.materials;
          this.totalResults = response.total;
          this.totalPages = response.totalPages;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erro ao aplicar filtros. Tente novamente.';
        this.loading = false;
        console.error('Erro nos filtros:', error);
      }
    });
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.performSearch().subscribe({
      next: (response: any) => {
        if (response) {
          this.searchResults = response.materials;
          this.totalResults = response.total;
          this.totalPages = response.totalPages;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erro ao ordenar resultados. Tente novamente.';
        this.loading = false;
        console.error('Erro na ordenação:', error);
      }
    });
  }

  private performSearch(): Observable<MaterialSearchResponse | null> {
    // Verificar se há algum critério de busca
    const hasBasicSearch = this.searchQuery.trim() || this.selectedCategory || this.selectedType || this.selectedStatus;
    const hasAdvancedSearch = this.advancedSearch.author || this.advancedSearch.publisher || this.advancedSearch.isbn ||
                             this.advancedSearch.publicationYear || this.advancedSearch.language ||
                             this.advancedSearch.location || this.advancedSearch.keywords ||
                             this.advancedSearch.startDate || this.advancedSearch.endDate;

    if (!hasBasicSearch && !hasAdvancedSearch) {
      this.searchResults = [];
      this.totalResults = 0;
      this.loading = false;
      return of(null);
    }

    const searchParams: MaterialSearchParams = {
      query: this.searchQuery.trim() || undefined,
      category: this.selectedCategory || undefined,
      type: this.selectedType || undefined,
      status: this.selectedStatus || undefined,
      author: this.advancedSearch.author || undefined,
      publisher: this.advancedSearch.publisher || undefined,
      isbn: this.advancedSearch.isbn || undefined,
      publicationYear: this.advancedSearch.publicationYear || undefined,
      language: this.advancedSearch.language || undefined,
      location: this.advancedSearch.location || undefined,
      keywords: this.advancedSearch.keywords || undefined,
      startDate: this.advancedSearch.startDate || undefined,
      endDate: this.advancedSearch.endDate || undefined,
      page: this.currentPage,
      limit: this.itemsPerPage,
      sortBy: this.sortBy as any,
      sortOrder: this.sortOrder as any
    };

    return this.materialService.searchMaterials(searchParams).pipe(
      takeUntil(this.destroy$)
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.performSearch().subscribe({
      next: (response: any) => {
        if (response) {
          this.searchResults = response.materials;
          this.totalResults = response.total;
          this.totalPages = response.totalPages;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erro ao carregar página. Tente novamente.';
        this.loading = false;
        console.error('Erro na paginação:', error);
      }
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedType = '';
    this.selectedStatus = '';
    this.sortBy = 'title';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.searchResults = [];
    this.totalResults = 0;
    this.searchTime = 0;
  }

  onAdvancedSearch(): void {
    this.currentPage = 1;
    this.performSearch().subscribe({
      next: (response: any) => {
        if (response) {
          this.searchResults = response.materials;
          this.totalResults = response.total;
          this.totalPages = response.totalPages;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erro na busca avançada. Tente novamente.';
        this.loading = false;
        console.error('Erro na busca avançada:', error);
      }
    });
  }

  clearAdvancedSearch(): void {
    this.advancedSearch = {
      author: '',
      publisher: '',
      isbn: '',
      publicationYear: null,
      language: '',
      location: '',
      keywords: '',
      startDate: '',
      endDate: ''
    };
    this.onAdvancedSearch();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
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
