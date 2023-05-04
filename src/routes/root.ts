import express from 'express';
import path from 'path';

const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/api/ping', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };

  try {
    res.send(healthCheck);
  } catch (error) {
    res.status(503).send();
  }
});

export default router;
