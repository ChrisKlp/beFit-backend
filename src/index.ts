import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import rootRouter from './routes/root';

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());

app.use('/', express.static('public'));
app.use('/', rootRouter);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '../public/404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: 'Not found' });
  } else {
    res.type('txt').send('Not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
