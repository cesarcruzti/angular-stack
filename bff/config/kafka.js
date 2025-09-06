const { Kafka } = require('kafkajs');
const { SchemaRegistry, readAVSC } = require('@kafkajs/confluent-schema-registry');
const avro = require('avsc');
const config = require('./index');

// Inicializa Kafka
const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: config.kafka.consumerGroup });

// Schema Registry
const registry = new SchemaRegistry({ host: config.kafka.schemaRegistry });

// Carrega schemas do disco
const commandSchema = readAVSC(config.kafka.schemas.command);
const responseSchemaJSON = readAVSC(config.kafka.schemas.response);

// Cria tipo Avro para validação adicional
const responseType = avro.Type.forSchema(responseSchemaJSON);

async function connectKafka() {
  await producer.connect();
  await consumer.connect();
}

// Publicar comando no Kafka com Avro
async function sendMessage(topic, message) {
  const { id } = await registry.register(commandSchema);
  const encodedMessage = await registry.encode(id, message);

  await producer.send({
    topic,
    messages: [{ value: encodedMessage }],
  });
}

// Consumir mensagens com validação Avro
async function consumeMessages(topic, callback) {
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const decodedMessage = await registry.decode(message.value);

        if (responseType.isValid(decodedMessage)) {
          callback(decodedMessage);
        } else {
          console.warn('Mensagem inválida recebida:', decodedMessage);
        }
      } catch (err) {
        console.error('Erro ao decodificar ou validar mensagem:', err);
      }
    },
  });
}

module.exports = { connectKafka, sendMessage, consumeMessages };