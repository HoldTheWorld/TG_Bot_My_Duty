import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import userRouter from './src/routers/userRouter.js'

const PORT = process.env.PORT ?? 3001;

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('hello ! ')
})

app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
