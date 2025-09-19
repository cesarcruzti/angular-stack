import { Kafka } from 'kafkajs';
import { SchemaRegistry, readAVSC } from '@kafkajs/confluent-schema-registry';
import avro from 'avsc';
import config from './index';
import { Command } from '../model/command.model';
import { info } from '../utils/logger';

// Inicializa Kafka
const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
  connectionTimeout: 30000,
  requestTimeout: 60000,
});

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: config.kafka.consumerGroup
});

// Schema Registry
const registry = new SchemaRegistry({ host: config.kafka.schemaRegistry });

// Carrega schemas do disco
const commandSchema = readAVSC(config.kafka.schemas.command);
const responseSchemaJSON = readAVSC(config.kafka.schemas.response);

// Cria tipo Avro para validação adicional
const responseType = avro.Type.forSchema(responseSchemaJSON);

let commandSchemaId: number;

async function connectKafka() {
  await producer.connect();
  await consumer.connect();
}

async function registerSchemas() {
  const { id } = await registry.register(commandSchema);
  commandSchemaId = id;
  info(`Schema for command registered with ID: ${commandSchemaId}`);
}

// Publicar comando no Kafka com Avro
async function sendMessage(command: Command) {
  type CommandPartial = Omit<Command, "traceparent" | "correlationid" | "id">;
  const { traceparent, correlationid, ...rest } = command;
  const partial: CommandPartial = rest;
  const encodedMessage = await registry.encode(commandSchemaId, partial);
  const topic = config.kafka.commandTopic || '';

  const headers: { [key: string]: string } = {};
  if (traceparent) {
    headers.traceparent = traceparent;
  }
  if (correlationid) {
    headers.correlationid = correlationid;
  }

  await producer.send({
    topic,
    messages: [{ value: encodedMessage, headers, key: command.commandId }],
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

export {
  connectKafka,
  sendMessage,
  consumeMessages,
  producer,
  consumer,
  registerSchemas,
};