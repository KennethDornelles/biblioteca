export enum MaterialType {
  BOOK = 'BOOK',
  MAGAZINE = 'MAGAZINE',
  JOURNAL = 'JOURNAL',
  DVD = 'DVD',
  CD = 'CD',
  THESIS = 'THESIS',
  DISSERTATION = 'DISSERTATION',
  MONOGRAPH = 'MONOGRAPH',
  ARTICLE = 'ARTICLE',
  MAP = 'MAP',
  OTHER = 'OTHER',
}

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  [MaterialType.BOOK]: 'Livro',
  [MaterialType.MAGAZINE]: 'Revista',
  [MaterialType.JOURNAL]: 'Jornal',
  [MaterialType.DVD]: 'DVD',
  [MaterialType.CD]: 'CD',
  [MaterialType.THESIS]: 'Tese',
  [MaterialType.DISSERTATION]: 'Dissertação',
  [MaterialType.MONOGRAPH]: 'Monografia',
  [MaterialType.ARTICLE]: 'Artigo',
  [MaterialType.MAP]: 'Mapa',
  [MaterialType.OTHER]: 'Outro',
};

export const MATERIAL_TYPE_ICONS: Record<MaterialType, string> = {
  [MaterialType.BOOK]: 'book',
  [MaterialType.MAGAZINE]: 'newspaper',
  [MaterialType.JOURNAL]: 'document-text',
  [MaterialType.DVD]: 'film',
  [MaterialType.CD]: 'musical-note',
  [MaterialType.THESIS]: 'academic-cap',
  [MaterialType.DISSERTATION]: 'academic-cap',
  [MaterialType.MONOGRAPH]: 'document',
  [MaterialType.ARTICLE]: 'document-text',
  [MaterialType.MAP]: 'map',
  [MaterialType.OTHER]: 'cube',
};
