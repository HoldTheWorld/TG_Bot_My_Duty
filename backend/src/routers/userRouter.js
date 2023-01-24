const router = require('express').Router();
// const bcrypt = require('bcrypt');
import { User } from '../db/models';

router.get('/', async (req, res) => {
  let users = await User.findAll({ raw: true})
  res.json(users)
  console.log(users);
});

