import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { EnvironmentVariables } from './environment.config';

export function setupSwagger(app: INestApplication, config: EnvironmentVariables) {
  if (config.NODE_ENV === 'production') {
    return; // Disable Swagger in production for security
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.SWAGGER_TITLE)
    .setDescription(config.SWAGGER_DESCRIPTION)
    .setVersion(config.SWAGGER_VERSION)
    .setContact(
      'Equipe de Desenvolvimento',
      'https://github.com/biblioteca-universitaria',
      'dev@biblioteca.edu.br',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(config.APP_URL, 'Servidor de Desenvolvimento')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Digite seu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoints de autenticação e autorização')
    .addTag('Users', 'Gerenciamento de usuários')
    .addTag('Students', 'Gerenciamento de estudantes')
    .addTag('Materials', 'Gerenciamento de materiais')
    .addTag('Loans', 'Gerenciamento de empréstimos')
    .addTag('Reservations', 'Gerenciamento de reservas')
    .addTag('Fines', 'Gerenciamento de multas')
    .addTag('Reports', 'Relatórios e estatísticas')
    .addTag('Notifications', 'Sistema de notificações')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(config.SWAGGER_PATH, app, document, {
    customSiteTitle: config.SWAGGER_TITLE,
    customfavIcon: '/favicon.ico',
    customCss: `
      .topbar-wrapper img {content:url('/logo.png'); width:40px; height:auto;}
      .swagger-ui .topbar { background-color: #1e3a8a; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  });
}
