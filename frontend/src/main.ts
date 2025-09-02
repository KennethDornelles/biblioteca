import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => {
    // Em produção, os erros devem ser tratados por um serviço de monitoramento
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro ao inicializar aplicação:', err);
    }
    // Aqui você pode adicionar lógica para enviar erros para um serviço de monitoramento
  });
