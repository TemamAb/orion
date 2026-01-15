
import express from 'express';
import { config } from './config';
import { processOpportunity } from './service';

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  if (!req.body || !req.body.message) {
    const msg = 'invalid Pub/Sub message format';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }

  const pubSubMessage = req.body.message;
  try {
    const data = JSON.parse(Buffer.from(pubSubMessage.data, 'base64').toString('utf-8'));
    console.log(`Received validated opportunity:`, data);

    await processOpportunity(data);

    res.status(204).send();
  } catch (error) {
    console.error(`Error processing message: ${error}`);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(config.port, () => {
  console.log(`Orion Executor Bot listening on port ${config.port}`);
});
