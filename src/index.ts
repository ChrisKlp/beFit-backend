import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import rootRouter from './routes/root';
import errorHandler from './middleware/errorHandler';
import corsOptions from './config/corsOptions';
import connectDB from './config/db';
import recipeRoutes from './routes/recipeRoutes';
import ingredientRoutes from './routes/ingredientRoutes';

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

connectDB();

app.use(corsOptions);
app.use(express.json());
app.use(cookieParser());

app.use('/', express.static('public'));
app.use('/', rootRouter);

app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);

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

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to database');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});
