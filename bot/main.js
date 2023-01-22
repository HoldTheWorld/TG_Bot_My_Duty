import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
dotenv.config()
const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});

import { get_User, reg_User } from "./functions.js"

 bot.on('message', async (msg) => {
  console.log(msg);
  let text = msg.text
  let chatId = msg.chat.id
  let user = msg.chat.username

  if (text == '/start') {
    bot.sendMessage(chatId, 'Привет!');
    let check_user = await get_User(user)
    if (!check_user) {
      bot.sendMessage(chatId, 'Чтобы воспользоваться ботом, введите /register');
    } else {
      bot.sendMessage(chatId, `С возвращением, ${msg.chat.username}!`);
    }
  }
  if (text == '/register') {
    let reg_result = await reg_User(user)
    
    console.log(reg_result)
    let message = 'empty message'
    switch (reg_result) {
      case 11011: message = 'вы уже зарегистрированы';
        break;
      case 12012: message = 'вы успешно зарегистрированы';
        break;
      case 13013: message = 'ошибка регистрации'
      default: message = 'что происходит?';
        break;
    }
    bot.sendMessage(chatId, message);
  }  
});
// 11011 пользователь уже зарегистирован 
// 12012 успешная регистрация
// 13013 ошибка при регистрации 
