import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Token Queue Microservice API',
      version: '1.0.0',
      description:
        'Clinical Token & Walk-in Queue Management Engine with Inter-Service Patient Resolution and Urgency Prioritization.',
    },
    servers: [
      {
        url: 'http://127.0.0.1:5011',
        description: 'Direct Microservice Port',
      },
      {
        url: 'https://dentalbackend.kyleinfotech.co.in/api/queue',
        description: 'Production API Gateway Proxy',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT token obtained from auth-service login.',
        },
      },
      schemas: {
        IssueTokenRequest: {
          type: 'object',
          required: ['doctorId', 'doctorName'],
          properties: {
            patientId: {
              type: 'string',
              description: 'Optional ID of existing registered patient.',
              example: '65fc23ab47a98810c9d78901',
            },
            patientName: {
              type: 'string',
              description: 'Required if patientId is omitted (for walk-ins).',
              example: 'Rahul Verma',
            },
            phone: {
              type: 'string',
              description: 'Required if patientId is omitted (for walk-ins).',
              example: '+91 98765 43210',
            },
            email: {
              type: 'string',
              description: 'Optional email address for walk-in patient.',
              example: 'rahul.verma@example.com',
            },
            age: {
              type: 'number',
              example: 34,
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female', 'Other'],
              default: 'Male',
              example: 'Male',
            },
            doctorId: {
              type: 'string',
              example: 'DOC-101',
            },
            doctorName: {
              type: 'string',
              example: 'Dr. Testing3',
            },
            service: {
              type: 'string',
              example: 'Root Canal Treatment Sitting 2',
            },
            roomNumber: {
              type: 'string',
              example: 'Chair 1',
            },
            priority: {
              type: 'string',
              enum: ['EMERGENCY', 'URGENT', 'SENIOR', 'APPOINTMENT', 'NORMAL'],
              default: 'NORMAL',
              example: 'URGENT',
            },
            notes: {
              type: 'string',
              example: 'Severe acute pulpitis pain on lower molar #36.',
            },
          },
        },
        QueueTokenResponse: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '67011d88a914c62bf8a11223' },
            tokenNumber: { type: 'number', example: 4 },
            tokenCode: { type: 'string', example: 'UR-04' },
            queueDate: { type: 'string', example: '2026-10-05' },
            patientId: { type: 'string', example: '65fc23ab47a98810c9d78901' },
            patientSnapshot: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Rahul Verma' },
                phone: { type: 'string', example: '+91 98765 43210' },
                age: { type: 'number', example: 34 },
                gender: { type: 'string', example: 'Male' },
              },
            },
            doctorId: { type: 'string', example: 'DOC-101' },
            doctorName: { type: 'string', example: 'Dr. Testing3' },
            service: { type: 'string', example: 'Root Canal Treatment Sitting 2' },
            roomNumber: { type: 'string', example: 'Chair 1' },
            priority: { type: 'string', example: 'URGENT' },
            priorityRank: { type: 'number', example: 2 },
            status: {
              type: 'string',
              enum: ['WAITING', 'IN_CONSULTATION', 'COMPLETED', 'SKIPPED', 'CANCELLED'],
              example: 'WAITING',
            },
            issuedTime: { type: 'string', format: 'date-time' },
            consultationStartTime: { type: 'string', format: 'date-time', nullable: true },
            consultationEndTime: { type: 'string', format: 'date-time', nullable: true },
            notes: { type: 'string', example: 'Severe acute pulpitis pain on lower molar #36.' },
          },
        },
        StatusUpdateRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['WAITING', 'IN_CONSULTATION', 'COMPLETED', 'SKIPPED', 'CANCELLED'],
              example: 'IN_CONSULTATION',
            },
          },
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
