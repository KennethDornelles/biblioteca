export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  FULFILLED = 'FULFILLED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  [ReservationStatus.ACTIVE]: 'Ativa',
  [ReservationStatus.FULFILLED]: 'Atendida',
  [ReservationStatus.EXPIRED]: 'Expirada',
  [ReservationStatus.CANCELLED]: 'Cancelada',
};

export const RESERVATION_STATUS_COLORS: Record<ReservationStatus, string> = {
  [ReservationStatus.ACTIVE]: 'success',
  [ReservationStatus.FULFILLED]: 'info',
  [ReservationStatus.EXPIRED]: 'warning',
  [ReservationStatus.CANCELLED]: 'secondary',
};

export const RESERVATION_STATUS_ICONS: Record<ReservationStatus, string> = {
  [ReservationStatus.ACTIVE]: 'clock',
  [ReservationStatus.FULFILLED]: 'check-circle',
  [ReservationStatus.EXPIRED]: 'exclamation-triangle',
  [ReservationStatus.CANCELLED]: 'close-circle',
};
