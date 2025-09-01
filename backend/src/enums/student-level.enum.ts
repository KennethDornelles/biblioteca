export enum StudentLevel {
  UNDERGRADUATE = 'UNDERGRADUATE',
  POSTGRADUATE = 'POSTGRADUATE',
  MASTERS = 'MASTERS',
  DOCTORATE = 'DOCTORATE',
  TECHNICAL = 'TECHNICAL',
}

export const STUDENT_LEVEL_LABELS: Record<StudentLevel, string> = {
  [StudentLevel.UNDERGRADUATE]: 'Graduação',
  [StudentLevel.POSTGRADUATE]: 'Pós-Graduação',
  [StudentLevel.MASTERS]: 'Mestrado',
  [StudentLevel.DOCTORATE]: 'Doutorado',
  [StudentLevel.TECHNICAL]: 'Técnico',
};

export const STUDENT_LEVEL_DESCRIPTIONS: Record<StudentLevel, string> = {
  [StudentLevel.UNDERGRADUATE]: 'Estudante de graduação (bacharelado ou licenciatura)',
  [StudentLevel.POSTGRADUATE]: 'Estudante de pós-graduação (especialização)',
  [StudentLevel.MASTERS]: 'Estudante de mestrado',
  [StudentLevel.DOCTORATE]: 'Estudante de doutorado',
  [StudentLevel.TECHNICAL]: 'Estudante de curso técnico',
};
