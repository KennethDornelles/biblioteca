import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService, Loan } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-detail.component.html',
  styleUrl: './loan-detail.component.scss'
})
export class LoanDetailComponent implements OnInit {
  loan: Loan | null = null;
  loading = false;
  error: string | null = null;
  loanId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loanId = this.route.snapshot.paramMap.get('id');
    if (this.loanId) {
      this.loadLoan();
    } else {
      this.error = 'ID do empréstimo não fornecido';
    }
  }

  loadLoan() {
    if (!this.loanId) return;

    this.loading = true;
    this.error = null;

    this.loanService.getLoanById(this.loanId).subscribe({
      next: (loan) => {
        this.loan = loan;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar empréstimo';
        this.loading = false;
        console.error('Erro ao carregar empréstimo:', error);
      }
    });
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
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateOnly(dateString: string): string {
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

  getDaysUntilDue(loan: Loan): number {
    if (loan.status === 'RETURNED') return 0;
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  returnLoan() {
    if (!this.loan) return;

    if (confirm('Confirmar devolução do empréstimo?')) {
      this.loanService.returnLoan(this.loan.id).subscribe({
        next: (updatedLoan) => {
          this.loan = updatedLoan;
        },
        error: (error) => {
          this.error = 'Erro ao devolver empréstimo';
          console.error('Erro ao devolver empréstimo:', error);
        }
      });
    }
  }

  editLoan() {
    if (this.loan) {
      this.router.navigate(['/loans', this.loan.id, 'edit']);
    }
  }

  deleteLoan() {
    if (!this.loan) return;

    if (confirm('Tem certeza que deseja excluir este empréstimo?')) {
      this.loanService.deleteLoan(this.loan.id).subscribe({
        next: () => {
          this.router.navigate(['/loans']);
        },
        error: (error) => {
          this.error = 'Erro ao excluir empréstimo';
          console.error('Erro ao excluir empréstimo:', error);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/loans']);
  }

  getLoanDuration(): number {
    if (!this.loan) return 0;

    const loanDate = new Date(this.loan.loanDate);
    const returnDate = this.loan.returnDate ? new Date(this.loan.returnDate) : new Date();
    const diffTime = returnDate.getTime() - loanDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getOverdueDays(): number {
    if (!this.loan) return 0;
    return this.getDaysOverdue(this.loan);
  }

  getRemainingDays(): number {
    if (!this.loan) return 0;
    return this.getDaysUntilDue(this.loan);
  }
}
