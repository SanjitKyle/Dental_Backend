import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Invoice Service API',
            version: '1.0.0',
            description: 'API documentation for Dental Hospital Invoice & Billing Service',
        },
        servers: [
            {
                url: 'http://localhost:5010',
                description: 'Direct Service Port'
            },
            {
                url: 'http://localhost:5000',
                description: 'API Gateway'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./src/router/*.js'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;
