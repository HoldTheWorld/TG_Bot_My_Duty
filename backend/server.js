import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
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

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
