import { SetMetadata } from '@nestjs/common';

/**
 * Chave para metadados de publicação de eventos
 */
export const PUBLISH_EVENT_METADATA = 'event:publish';

/**
 * Interface para metadados de publicação
 */
export interface PublishEventMetadata {
  eventType: string;
  eventFactory: (result: any, args: any[]) => any;
}

/**
 * Decorator para marcar métodos que devem publicar eventos após execução
 * @param eventType Tipo do evento a ser publicado
 * @param eventFactory Função que cria o evento baseado no resultado e argumentos
 */
export const PublishEvent = <T = any>(
  eventType: string,
  eventFactory: (result: T, args: any[]) => any
) => SetMetadata(PUBLISH_EVENT_METADATA, { eventType, eventFactory });
