import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = ['http://localhost:5173', process.env.ALLOWED_ORIGIN];

const corsOptions = cors({
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
});

export default corsOptions;
