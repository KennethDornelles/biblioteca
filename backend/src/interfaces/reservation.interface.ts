import { ReservationStatus } from '../enums';

export interface IReservation {
  id: string;
  userId: string;
  materialId: string;
  reservationDate: Date;
  expirationDate: Date;
  status: ReservationStatus;
  priority: number;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateReservation {
  userId: string;
  materialId: string;
  reservationDate?: Date;
  expirationDate: Date;
  priority?: number;
  observations?: string;
}

export interface IUpdateReservation {
  status?: ReservationStatus;
  priority?: number;
  observations?: string;
}

export interface IReservationFilters {
  userId?: string;
  materialId?: string;
  status?: ReservationStatus;
  reservationDateFrom?: Date;
  reservationDateTo?: Date;
  expirationDateFrom?: Date;
  expirationDateTo?: Date;
  active?: boolean;
  expired?: boolean;
}

export interface IReservationSearchParams {
  filters?: IReservationFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IReservationResponse {
  id: string;
  userId: string;
  materialId: string;
  reservationDate: Date;
  expirationDate: Date;
  status: ReservationStatus;
  priority: number;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
  statusLabel: string;
  statusColor: string;
  statusIcon: string;
  isExpired: boolean;
  daysUntilExpiration: number;
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
    status: string;
  };
}

export interface IPaginatedReservations {
  reservations: IReservationResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IReservationStatistics {
  total: number;
  active: number;
  fulfilled: number;
  expired: number;
  cancelled: number;
  averagePriority: number;
  byStatus: Record<ReservationStatus, number>;
  byMonth: Record<string, number>;
}

export interface IReservationQueue {
  materialId: string;
  materialTitle: string;
  queue: Array<{
    userId: string;
    userName: string;
    reservationDate: Date;
    priority: number;
    daysWaiting: number;
  }>;
  totalWaiting: number;
  estimatedWaitTime: number;
}
