import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clinic Service API (SaaS Multi-Tenancy)',
      version: '1.0.0',
      description: 'Clinic Tenant Management, White-Label Profiles, and Subscription Entitlements.',
    },
    servers: [
      { url: 'http://127.0.0.1:5012', description: 'Direct Microservice' },
      { url: 'https://dentalbackend.kyleinfotech.co.in/api/clinics', description: 'API Gateway Proxy' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;
