import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Staff Service API',
            version: '1.0.0',
            description: 'API documentation for Staff Service',
        },
        servers: [
            {
                url: 'http://localhost:5008', // Assuming port 5008 based on server.js
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
