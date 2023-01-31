require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRouter = require('./src/routers/userRouter');
const dutyRouter = require('./src/routers/dutyRouter');
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

app.use('/users', userRouter);
app.use('/duties', dutyRouter);

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
