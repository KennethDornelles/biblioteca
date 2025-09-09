import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MaterialService } from '../../services/material.service';
import { Material, MaterialType, MaterialStatus } from '../../models/material.model';

@Component({
  selector: 'app-material-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './material-detail.component.html',
  styleUrl: './material-detail.component.scss'
})
export class MaterialDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  material: Material | null = null;
  relatedMaterials: Material[] = [];
  loading = false;
  error: string | null = null;
  materialId: string | null = null;

  constructor(
    private materialService: MaterialService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
        this.materialId = params['id'];
        if (this.materialId) {
          this.loadMaterial();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadMaterial(): void {
    if (!this.materialId) return;

    this.loading = true;
    this.error = null;

    this.materialService.getMaterialById(this.materialId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (material: any) => {
          this.material = material;
          this.loadRelatedMaterials();
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Erro ao carregar detalhes do material.';
          this.loading = false;
          console.error('Erro ao carregar material:', error);
        }
      });
  }

  private loadRelatedMaterials(): void {
    if (!this.materialId) return;

    this.materialService.getRelatedMaterials(this.materialId, 5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (materials: any) => {
          this.relatedMaterials = materials;
        },
        error: (error: any) => {
          console.error('Erro ao carregar materiais relacionados:', error);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/materials']);
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }

  goToCategory(category: string): void {
    this.router.navigate(['/materials/category', category]);
  }

  goToType(type: string): void {
    this.router.navigate(['/materials/type', type]);
  }

  goToMaterial(materialId: string): void {
    this.router.navigate(['/material', materialId]);
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

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }

  formatCurrency(value: number | undefined): string {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getKeywordsArray(): string[] {
    if (!this.material?.keywords) return [];
    return this.material.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
  }

  canBorrow(): boolean {
    return this.material?.status === MaterialStatus.AVAILABLE;
  }

  canReserve(): boolean {
    return this.material?.status === MaterialStatus.LOANED;
  }
}
