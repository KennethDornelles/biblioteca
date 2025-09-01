import { LoanStatus } from '../../enums';

export class Loan {
  id: string;
  userId: string;
  materialId: string;
  librarianId?: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  renewalDate?: Date;
  status: LoanStatus;
  renewals: number;
  maxRenewals: number;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Loan>) {
    Object.assign(this, data);
  }

  static create(data: Partial<Loan>): Loan {
    return new Loan(data);
  }

  update(data: Partial<Loan>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  changeStatus(newStatus: LoanStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  return(returnDate: Date = new Date(), observations?: string): void {
    this.status = LoanStatus.RETURNED;
    this.returnDate = returnDate;
    if (observations) {
      this.observations = observations;
    }
    this.updatedAt = new Date();
  }

  renew(observations?: string): void {
    this.status = LoanStatus.RENEWED;
    this.renewals += 1;
    this.renewalDate = new Date();
    if (observations) {
      this.observations = observations;
    }
    this.updatedAt = new Date();
  }

  cancel(observations?: string): void {
    this.status = LoanStatus.CANCELLED;
    if (observations) {
      this.observations = observations;
    }
    this.updatedAt = new Date();
  }

  markAsOverdue(): void {
    if (this.status === LoanStatus.ACTIVE) {
      this.status = LoanStatus.OVERDUE;
      this.updatedAt = new Date();
    }
  }

  isActive(): boolean {
    return this.status === LoanStatus.ACTIVE;
  }

  isReturned(): boolean {
    return this.status === LoanStatus.RETURNED;
  }

  isOverdue(): boolean {
    return this.status === LoanStatus.OVERDUE;
  }

  isRenewed(): boolean {
    return this.status === LoanStatus.RENEWED;
  }

  isCancelled(): boolean {
    return this.status === LoanStatus.CANCELLED;
  }

  canBeRenewed(): boolean {
    return this.status === LoanStatus.ACTIVE && this.renewals < this.maxRenewals;
  }

  canBeReturned(): boolean {
    return this.status === LoanStatus.ACTIVE || this.status === LoanStatus.OVERDUE;
  }

  canBeCancelled(): boolean {
    return this.status === LoanStatus.ACTIVE || this.status === LoanStatus.OVERDUE;
  }

  getDaysOverdue(): number {
    if (this.status !== LoanStatus.ACTIVE && this.status !== LoanStatus.OVERDUE) {
      return 0;
    }
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  isOverdueByDays(days: number): boolean {
    return this.getDaysOverdue() >= days;
  }

  getRenewalsRemaining(): number {
    return Math.max(0, this.maxRenewals - this.renewals);
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      materialId: this.materialId,
      librarianId: this.librarianId,
      loanDate: this.loanDate,
      dueDate: this.dueDate,
      returnDate: this.returnDate,
      renewalDate: this.renewalDate,
      status: this.status,
      renewals: this.renewals,
      maxRenewals: this.maxRenewals,
      observations: this.observations,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

