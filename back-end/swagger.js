const swaggerAutogen = require('swagger-autogen');

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

const doc = {
  info: {
    title: 'Classroom Management',
    description: 'Apis supports feature of project!',
    version: '1.0.0',
  },
  host: 'localhost:9000', 
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Some description...'
    }
  },
  tags: [
    { name: 'Login', description: 'Operations related to login' }
  ],
};
const swaggerAuto = swaggerAutogen();
swaggerAuto(outputFile, endpointsFiles, doc).then(() => {
    require('./swagger-output.json');
});
