import dotenv from 'dotenv';
import express from 'express';
import rootRouter from './routes/root';

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());

app.use('/', express.static('public'));
app.use('/', rootRouter);

app.get('/', (req, res) => {
  res.send('HELLO FROM EXPRESSsss');
});

app.listen(PORT, () => {
  console.log(`now listening on port ${PORT}`);
});
