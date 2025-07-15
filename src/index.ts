import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import todoRoutes from './routes/todo.routes';
import prisma from './Prisma';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use('/api', todoRoutes);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/', (req, res) => res.send('Server is running ✅'));

const createDefaultUser = async () => {
  const userExists = await prisma.user.findUnique({ where: { id: 1 } });
  if (!userExists) {
    await prisma.user.create({
      data: {
        id: 1,
        email: 'default@example.com',
        password: 'dummy-password', // hashed in real apps
      },
    });
    console.log('✅ Default user created');
  }
};

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

