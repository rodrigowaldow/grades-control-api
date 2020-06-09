const swaggerDocument = {
  swagger: '2.0',
  info: {
    description: 'This is a Grades Control server.',
    version: '1.0.0',
    title: 'Grades Control API',
  },
  host: 'localhost:3000/grade',
  tags: [
    {
      name: 'grade',
      description: 'Everything about Grades',
    },
  ],
  schemes: ['https', 'http'],
  paths: {
    '/': {
      post: {
        tags: ['grade'],
        summary: 'Add a new grade to JSON',
        description: '',
        operationId: 'add',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Grade object that needs to be added to JSON',
            required: true,
            schema: {
              $ref: '#/definitions/Grade',
            },
          },
        ],
        responses: {
          '405': {
            description: 'Invalid input',
          },
        },
      },
      put: {
        tags: ['grade'],
        summary: 'Update an existing grade',
        description: '',
        operationId: 'updatePet',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Grade object that needs to be added to JSON',
            required: true,
            schema: {
              $ref: '#/definitions/Grade',
            },
          },
        ],
        responses: {
          '400': {
            description: 'Invalid ID supplied',
          },
          '404': {
            description: 'Grade not found',
          },
          '405': {
            description: 'Validation exception',
          },
        },
      },
    },
  },
  definitions: {
    Grade: {
      type: 'object',
      required: ['student', 'subject', 'type', 'value'],

      properties: {
        id: {
          type: 'integer',
          format: 'int64',
        },
        student: {
          type: 'string',
          example: 'Roberto Achar',
        },
        subject: {
          type: 'string',
          example: '03 - React',
        },
        type: {
          type: 'string',
          example: 'Fórum',
        },
        value: {
          type: 'float',
          example: 10,
        },
      },
    },
  },
};

module.exports = swaggerDocument;
