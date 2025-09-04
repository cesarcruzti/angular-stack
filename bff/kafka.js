const { Kafka } = require('kafkajs');
const { SchemaRegistry, readAVSC } = require('@kafkajs/confluent-schema-registry');
const path = require('path');

const kafka = new Kafka({
  clientId: 'bff-client',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'bff-consumer-group' });

const registry = new SchemaRegistry({ host: 'http://localhost:8081' });

// Carrega os schemas
const commandSchema = readAVSC(path.join(__dirname, 'schemas', 'PaperValuationCommand.avsc'));
const responseSchema = readAVSC(path.join(__dirname, 'schemas', 'PaperValuationResponse.avsc'));

async function connectKafka() {
  await producer.connect();
  await consumer.connect();
}

async function sendMessage(topic, message) {
  const { id } = await registry.register(commandSchema); // registra/pega schema ID
  const encodedMessage = await registry.encode(id, message);

  await producer.send({
    topic,
    messages: [{ value: encodedMessage }]
  });
}

async function consumeMessages(topic, callback) {
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const decoded = await registry.decode(message.value);
      callback(decoded);
    }
  });
}

module.exports = { connectKafka, sendMessage, consumeMessages };
