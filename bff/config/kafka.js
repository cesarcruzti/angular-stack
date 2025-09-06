const { Kafka } = require('kafkajs');
const { SchemaRegistry, readAVSC } = require('@kafkajs/confluent-schema-registry');
const path = require('path');
const avro = require('avsc');

const kafka = new Kafka({
  clientId: 'bff-client',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'bff-consumer-group' });

const registry = new SchemaRegistry({ host: 'http://localhost:8081' });

// Carrega schemas
const commandSchema = readAVSC(path.join(__dirname, 'schemas', 'PaperValuationCommand.avsc'));
const responseSchemaJSON = readAVSC(path.join(__dirname, 'schemas', 'PaperValuationResponse.avsc'));

// Cria tipo Avro para validação
const responseType = avro.Type.forSchema(responseSchemaJSON);

async function connectKafka() {
  await producer.connect();
  await consumer.connect();
}

// Publicar comando
async function sendMessage(topic, message) {
  const { id } = await registry.register(commandSchema);
  const encodedMessage = await registry.encode(id, message);

  await producer.send({
    topic,
    messages: [{ value: encodedMessage }]
  });
}

// Consumir mensagens com validação Avro
async function consumeMessages(topic, callback) {
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        // Decodifica mensagem do Schema Registry
        const decodedMessage = await registry.decode(message.value);

        // Valida explicitamente usando avsc
        if (responseType.isValid(decodedMessage)) {
          callback(decodedMessage);
        } else {
          console.warn('Mensagem inválida recebida:', decodedMessage);
        }
      } catch (err) {
        console.error('Erro ao decodificar ou validar a mensagem:', err);
      }
    }
  });
}

module.exports = { connectKafka, sendMessage, consumeMessages };