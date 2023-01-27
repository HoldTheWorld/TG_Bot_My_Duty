import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
dotenv.config()
const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});

import { get_User, reg_User } from "./functions.js"

const keyboardStart = [
  [
    {
      text: 'Мои задачи', 
      callback_data: 'taskList' // данные для обработчика событий
    }
  ],
  [
    {
      text: 'Добавить задачу',
      callback_data: 'addTask'
    }
  ],
  [
    {
      text: 'Посмотреть мою статистику',
      callback_data: 'sendStat',
      url: '' //внешняя ссылка
    }
  ]
];
 bot.on('message', async (msg) => {
  console.log(msg.chat.username + '  ' + msg.text );
  let text = msg.text
  let chatId = msg.chat.id
  let user = msg.chat.username

  if (text == '/start') {
    bot.sendMessage(chatId, 'Привет!');
    let check_user = await get_User(user)

    if (!check_user) {
      bot.sendMessage(chatId, 'Чтобы воспользоваться ботом, введите /register');
    } else {
      bot.sendMessage(chatId, `С возвращением, ${msg.chat.username}!`, {
        reply_markup: {
          inline_keyboard: keyboardStart
        }
      } );
    }
  }
  if (text == '/register') {
    let reg_result = await reg_User(user)
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
    bot.sendMessage(chatId, message, { 
      if (reg_result = 12012 || 11011 ) {
        console.log('keyboard');
        reply_markup: {
          inline_keyboard: keyboardStart
        }
      }
    });
  }  
});
// 11011 пользователь уже зарегистирован 
// 12012 успешная регистрация
// 13013 ошибка при регистрации 

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    console.log('lalala');
    if (query.data === 'taskList') { 

      console.log('taskList');
      // let taskList = await get_Tasks(query.message.chat.username)
    }
    if (query.data === 'addTask') { 
      console.log('addTask');
   
      // let newTask = await add_Task(query.message.chat.username)
    }
    if (query.data === 'sendStat') { 
      console.log('addTask');
     
      // let myStat = await get_Stat(query.message.chat.username)
    }
  
  });


