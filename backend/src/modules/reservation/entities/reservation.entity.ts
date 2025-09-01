import { ReservationStatus } from '../../../enums';

export class Reservation {
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

  constructor(partial: Partial<Reservation>) {
    Object.assign(this, partial);
  }

  // Métodos de negócio
  isExpired(): boolean {
    return new Date() > this.expirationDate;
  }

  daysUntilExpiration(): number {
    const now = new Date();
    const diffTime = this.expirationDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  canBeFulfilled(): boolean {
    return this.status === ReservationStatus.ACTIVE && !this.isExpired();
  }

  isHighPriority(): boolean {
    return this.priority >= 8;
  }

  isMediumPriority(): boolean {
    return this.priority >= 4 && this.priority <= 7;
  }

  isLowPriority(): boolean {
    return this.priority <= 3;
  }
}
