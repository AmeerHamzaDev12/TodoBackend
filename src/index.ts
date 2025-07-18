import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import todoRoutes from './routes/todo.routes';
import authrouter from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use('/api', todoRoutes);
app.use('/api', authrouter);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/', (req, res) => res.send('Server is running ✅'));


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

