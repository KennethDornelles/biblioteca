/**
 * Utilitários para lidar com variáveis de ambiente de forma segura
 */

/**
 * Converte uma variável de ambiente para número com valor padrão
 * @param value - Valor da variável de ambiente
 * @param defaultValue - Valor padrão se a variável não existir ou for inválida
 * @returns Número convertido ou valor padrão
 */
export function parseEnvNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Converte uma variável de ambiente para boolean
 * @param value - Valor da variável de ambiente
 * @param defaultValue - Valor padrão se a variável não existir
 * @returns Boolean convertido ou valor padrão
 */
export function parseEnvBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * Converte uma variável de ambiente para string com valor padrão
 * @param value - Valor da variável de ambiente
 * @param defaultValue - Valor padrão se a variável não existir
 * @returns String ou valor padrão
 */
export function parseEnvString(value: string | undefined, defaultValue: string): string {
  return value || defaultValue;
}

/**
 * Converte uma variável de ambiente para array de strings
 * @param value - Valor da variável de ambiente (separado por vírgula)
 * @param defaultValue - Valor padrão se a variável não existir
 * @returns Array de strings ou valor padrão
 */
export function parseEnvArray(value: string | undefined, defaultValue: string[]): string[] {
  if (!value) return defaultValue;
  return value.split(',').map(item => item.trim()).filter(Boolean);
}
