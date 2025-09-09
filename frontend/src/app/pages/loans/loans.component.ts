import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService, Loan, LoanFilters } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.scss'
})
export class LoansComponent implements OnInit {
  loans: Loan[] = [];
  filteredLoans: Loan[] = [];
  loading = false;
  error: string | null = null;

  // Filtros
  filters: LoanFilters = {
    status: '',
    page: 1,
    limit: 10
  };

  // Paginação
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;

  // Status disponíveis
  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'ACTIVE', label: 'Ativos' },
    { value: 'RETURNED', label: 'Devolvidos' },
    { value: 'OVERDUE', label: 'Atrasados' },
    { value: 'LOST', label: 'Perdidos' }
  ];

  // Estatísticas
  stats = {
    total: 0,
    active: 0,
    overdue: 0,
    returned: 0
  };

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLoans();
    this.loadStats();
  }

  loadLoans() {
    this.loading = true;
    this.error = null;

    this.loanService.getLoans(this.filters).subscribe({
      next: (response) => {
        this.loans = response.data;
        this.filteredLoans = response.data;
        this.currentPage = response.page;
        this.totalPages = response.totalPages;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar empréstimos';
        this.loading = false;
        console.error('Erro ao carregar empréstimos:', error);
      }
    });
  }

  loadStats() {
    // Carregar estatísticas básicas
    this.loanService.getLoans({ limit: 1000 }).subscribe({
      next: (response) => {
        this.stats.total = response.total;
        this.stats.active = response.data.filter(loan => loan.status === 'ACTIVE').length;
        this.stats.overdue = response.data.filter(loan => loan.status === 'OVERDUE').length;
        this.stats.returned = response.data.filter(loan => loan.status === 'RETURNED').length;
      }
    });
  }

  applyFilters() {
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadLoans();
  }

  clearFilters() {
    this.filters = {
      status: '',
      page: 1,
      limit: this.itemsPerPage
    };
    this.loadLoans();
  }

  onPageChange(page: number) {
    this.filters.page = page;
    this.currentPage = page;
    this.loadLoans();
  }

  onItemsPerPageChange() {
    this.filters.limit = this.itemsPerPage;
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadLoans();
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      'ACTIVE': 'status-active',
      'RETURNED': 'status-returned',
      'OVERDUE': 'status-overdue',
      'LOST': 'status-lost'
    };
    return statusClasses[status as keyof typeof statusClasses] || '';
  }

  getStatusLabel(status: string): string {
    const statusLabels = {
      'ACTIVE': 'Ativo',
      'RETURNED': 'Devolvido',
      'OVERDUE': 'Atrasado',
      'LOST': 'Perdido'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  isOverdue(loan: Loan): boolean {
    if (loan.status === 'RETURNED') return false;
    return new Date(loan.dueDate) < new Date();
  }

  getDaysOverdue(loan: Loan): number {
    if (!this.isOverdue(loan)) return 0;
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  viewLoan(loan: Loan) {
    this.router.navigate(['/loans', loan.id]);
  }

  editLoan(loan: Loan) {
    this.router.navigate(['/loans', loan.id, 'edit']);
  }

  returnLoan(loan: Loan) {
    if (confirm('Confirmar devolução do empréstimo?')) {
      this.loanService.returnLoan(loan.id).subscribe({
        next: () => {
          this.loadLoans();
          this.loadStats();
        },
        error: (error) => {
          this.error = 'Erro ao devolver empréstimo';
          console.error('Erro ao devolver empréstimo:', error);
        }
      });
    }
  }

  deleteLoan(loan: Loan) {
    if (confirm('Tem certeza que deseja excluir este empréstimo?')) {
      this.loanService.deleteLoan(loan.id).subscribe({
        next: () => {
          this.loadLoans();
          this.loadStats();
        },
        error: (error) => {
          this.error = 'Erro ao excluir empréstimo';
          console.error('Erro ao excluir empréstimo:', error);
        }
      });
    }
  }

  createLoan() {
    this.router.navigate(['/loans/new']);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Método para usar no template
  get Math() {
    return Math;
  }
}
