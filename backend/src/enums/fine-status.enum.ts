export enum FineStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  INSTALLMENT = 'INSTALLMENT',
}

export const FINE_STATUS_LABELS: Record<FineStatus, string> = {
  [FineStatus.PENDING]: 'Pendente',
  [FineStatus.PAID]: 'Paga',
  [FineStatus.CANCELLED]: 'Cancelada',
  [FineStatus.INSTALLMENT]: 'Parcelada',
};

export const FINE_STATUS_COLORS: Record<FineStatus, string> = {
  [FineStatus.PENDING]: 'warning',
  [FineStatus.PAID]: 'success',
  [FineStatus.CANCELLED]: 'secondary',
  [FineStatus.INSTALLMENT]: 'info',
};

export const FINE_STATUS_ICONS: Record<FineStatus, string> = {
  [FineStatus.PENDING]: 'clock',
  [FineStatus.PAID]: 'check-circle',
  [FineStatus.CANCELLED]: 'close-circle',
  [FineStatus.INSTALLMENT]: 'calculator',
};
