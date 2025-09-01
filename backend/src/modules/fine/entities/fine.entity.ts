import { FineStatus } from '../../../enums';

export class Fine {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  daysOverdue: number;
  creationDate: Date;
  dueDate: Date;
  paymentDate?: Date;
  status: FineStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Fine>) {
    Object.assign(this, partial);
  }

  // Métodos de negócio
  isOverdue(): boolean {
    return new Date() > this.dueDate;
  }

  daysUntilDue(): number {
    const now = new Date();
    const diffTime = this.dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  canBePaid(): boolean {
    return this.status === FineStatus.PENDING || this.status === FineStatus.INSTALLMENT;
  }

  isPaid(): boolean {
    return this.status === FineStatus.PAID;
  }

  isCancelled(): boolean {
    return this.status === FineStatus.CANCELLED;
  }

  isInstallment(): boolean {
    return this.status === FineStatus.INSTALLMENT;
  }

  getFormattedAmount(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.amount);
  }

  getDailyRate(): number {
    // Taxa diária padrão de R$ 1,00 por dia de atraso
    return 1.00;
  }

  calculateInterest(): number {
    if (this.isPaid() || this.isCancelled()) {
      return 0;
    }
    
    const overdueDays = Math.max(0, -this.daysUntilDue());
    const dailyRate = this.getDailyRate();
    return overdueDays * dailyRate;
  }

  getTotalAmount(): number {
    return this.amount + this.calculateInterest();
  }
}
