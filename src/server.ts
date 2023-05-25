/* eslint-disable no-console */
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import path from 'path';
import corsOptions from './config/corsOptions';
import connectDB from './config/db';
import errorMiddleware from './middleware/errorMiddleware';
import logger from './middleware/logger';
import './process';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import recipeRoutes from './routes/recipeRoutes';
import rootRouter from './routes/root';
import userRoutes from './routes/userRoutes';
import workoutRoutes from './routes/workoutRoutes';
import menuRoutes from './routes/menuRoutes';
import userWorkoutRoutes from './routes/userWorkoutRoutes';

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

connectDB();

app.use(logger);
app.use(corsOptions);
app.use(express.json());
app.use(cookieParser());

app.use('/', express.static('public'));
app.use('/', rootRouter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/userWorkouts', userWorkoutRoutes);

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

app.use(errorMiddleware);

mongoose.connection.once('open', () => {
  console.log('Connected to database');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});
