import { Kafka } from 'kafkajs';
import { SchemaRegistry, readAVSC } from '@kafkajs/confluent-schema-registry';
import avro from 'avsc';
import config from './index';
import { PaperRange } from '../model/paper-range.model';
import { daysSinceEpoch } from '../utils/datetime';
import { v4 as uuidv4 } from 'uuid';

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
async function sendMessage(message: any, headers: any) {
  const { id } = await registry.register(commandSchema);
  const encodedMessage = await registry.encode(id, message);
  const topic = config.kafka.commandTopic || '';
  await producer.send({
    topic,
    messages: [{ value: encodedMessage, headers }],
  });
}

async function sendMessages(paperRanges: PaperRange[], headers: any) {
  if (!paperRanges || paperRanges.length === 0) {
    return;
  }
  let referenceDate = daysSinceEpoch();
  const { id } = await registry.register(commandSchema);
  const encodedMessages = await Promise.all(
    paperRanges.map(async (range) => {
      const message = {
        commandId: uuidv4(),
        initialEntity: range.initialEntity,
        finalEntity: range.finalEntity,
        referenceDate
      }
      const encoded = await registry.encode(id, message);
      return { value: encoded, headers: headers };
    })
  );
  const topic = config.kafka.commandTopic || '';
  await producer.send({
    topic,
    messages: encodedMessages,
  });
}


async function consumeMessages(topic: string, callback: any) {
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }: any) => {
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

export { connectKafka, sendMessage, sendMessages, consumeMessages, producer, consumer };