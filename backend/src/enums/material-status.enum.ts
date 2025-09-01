export enum MaterialStatus {
  AVAILABLE = 'AVAILABLE',
  LOANED = 'LOANED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
  LOST = 'LOST',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

export const MATERIAL_STATUS_LABELS: Record<MaterialStatus, string> = {
  [MaterialStatus.AVAILABLE]: 'Disponível',
  [MaterialStatus.LOANED]: 'Emprestado',
  [MaterialStatus.RESERVED]: 'Reservado',
  [MaterialStatus.MAINTENANCE]: 'Em Manutenção',
  [MaterialStatus.LOST]: 'Perdido',
  [MaterialStatus.DECOMMISSIONED]: 'Descomissionado',
};

export const MATERIAL_STATUS_COLORS: Record<MaterialStatus, string> = {
  [MaterialStatus.AVAILABLE]: 'success',
  [MaterialStatus.LOANED]: 'warning',
  [MaterialStatus.RESERVED]: 'info',
  [MaterialStatus.MAINTENANCE]: 'secondary',
  [MaterialStatus.LOST]: 'danger',
  [MaterialStatus.DECOMMISSIONED]: 'dark',
};
