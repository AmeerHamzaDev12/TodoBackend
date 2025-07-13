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
app.use('/api/todos', todoRoutes);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/', (req, res) => res.send('Server is running ✅'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

const main =  async ()=>{
    const user = await prisma.user.create({
        data:{
            id:1,
            email:"Hamza@gmail.com",
            password:"12345678"
        }
    });
    console.log(user);
};
main();
