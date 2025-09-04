const express = require('express');
const bodyParser = require('body-parser');
const { connectKafka, sendMessage, consumeMessages } = require('./kafka');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

const COMMAND_TOPIC = 'asset.management.consumer.paper.valuation.command';
const RESPONSE_TOPIC = 'asset.management.producer.paper.valuation.response';

// Conecta ao Kafka
connectKafka().then(() => console.log('Kafka conectado'));

// Publicar comando
app.post('/send/command', async (req, res) => {
  const { initialEntity, finalEntity, referenceDate } = req.body;

  const command = {
    commandId: uuidv4(),
    initialEntity,
    finalEntity,
    referenceDate
  };

  try {
    await sendMessage(COMMAND_TOPIC, command);
    res.status(200).json({ status: 'Command sent successfully', commandId: command.commandId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send command' });
  }
});

// Stream SSE de respostas
app.get('/stream/response', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  consumeMessages(RESPONSE_TOPIC, sendEvent).catch(console.error);

  req.on('close', () => {
    console.log('Client disconnected from SSE');
    res.end();
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`BFF rodando em http://localhost:${PORT}`);
});
