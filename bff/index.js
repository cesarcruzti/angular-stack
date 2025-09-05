const express = require('express');
const bodyParser = require('body-parser');
const { connectKafka, sendMessage, consumeMessages } = require('./kafka');
const { v4: uuidv4 } = require('uuid');
const database = require('./database');

const app = express();
app.use(bodyParser.json());


const COMMAND_TOPIC = 'asset.management.consumer.paper.valuation.command';
const RESPONSE_TOPIC = 'asset.management.producer.paper.valuation.response';

connectKafka()
  .then(() => {
    console.log('Kafka conectado');
    consumeMessages(RESPONSE_TOPIC, async (message) => {
      const data = JSON.stringify(message);
      await database.table('paper_valuation_response').insert({data});
    });
  })
  .catch(console.error);

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

app.get('/stream/response', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let changefeedCursor = null;

  try {
    changefeedCursor = await database.table('paper_valuation_response').changes().run();

    changefeedCursor.each((err, change) => {
      if (err) {
        console.error('Erro no feed de mudanças do RethinkDB:', err);
        return;
      }

      if (change.new_val) {
        res.write(`data: ${JSON.stringify(change.new_val.data)}\n\n`);
      }
    });

  } catch (err) {
    console.error('Falha ao conectar ou iniciar o feed de mudanças:', err);
    res.write(`data: ${JSON.stringify({ error: 'Falha ao iniciar o feed de dados' })}\n\n`);
    res.end();
  }

  req.on('close', () => {
    console.log('Cliente desconectado do SSE. Fechando o cursor do RethinkDB.');
    if (changefeedCursor) {
      changefeedCursor.close();
    }
    res.end();
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`BFF rodando em http://localhost:${PORT}`);
});
