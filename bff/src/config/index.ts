require('dotenv').config();
const path = require('path');

const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'bff-client',
    consumerGroup: process.env.KAFKA_CONSUMER_GROUP || 'bff-consumer-group',
    commandTopic: process.env.COMMAND_TOPIC,
    responseTopic: process.env.RESPONSE_TOPIC,
    schemaRegistry: process.env.SCHEMA_REGISTRY || 'http://localhost:8081',
    schemas: {
      command: path.join(__dirname, '../config/schemas/PaperValuationCommand.avsc'),
      response: path.join(__dirname, '../config/schemas/PaperValuationResponse.avsc'),
    }
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 28015,
    name: process.env.DB_NAME || 'bff',
    password: process.env.DB_PASSWORD || 'rethinkdb'
  }
};

export default config;