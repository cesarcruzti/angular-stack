const commandService = require('../services/command.service');

async function sendCommand(req, res) {
  try {
    const commandId = await commandService.send(req.body);
    res.status(200).json({ status: 'Command sent successfully', commandId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send command' });
  }
}

module.exports = { sendCommand };
