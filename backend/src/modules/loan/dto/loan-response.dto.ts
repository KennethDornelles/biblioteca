import { LoanStatus } from '../../../enums';

export class LoanResponseDto {
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
  statusLabel: string;
  statusColor: string;
  statusIcon: string;
  isOverdue: boolean;
  daysOverdue: number;
  canRenew: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    registrationNumber?: string;
  };
  material?: {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    assetNumber?: string;
  };
  librarian?: {
    id: string;
    name: string;
    email: string;
  };
}

