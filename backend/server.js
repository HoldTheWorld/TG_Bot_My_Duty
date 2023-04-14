require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRouter = require('./src/routers/userRouter');
const dutyRouter = require('./src/routers/dutyRouter');
const timingRouter = require('./src/routers/timingRouter')
const PORT = process.env.PORT ?? 4321;

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

http://numbersapi.com/#42

app.use('/users', userRouter);
app.use('/duties', dutyRouter);
app.use('/timings', timingRouter)

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
