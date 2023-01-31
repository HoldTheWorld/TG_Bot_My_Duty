import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
dotenv.config()
const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});

import { get_User, reg_User, get_Duties, add_Duty } from "./functions.js"
let keyboardStart = [
  [
    {
      text: 'Мои задачи', 
      callback_data: 'dutyList' // данные для обработчика событий
    }
  ],
  [
    {
      text: 'Добавить задачу',
      callback_data: 'addDuty'
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

bot.setMyCommands([
  {command: '/start' , description: 'старт'},
  {command: '/register' , description: 'регистрация'}
])

 bot.on('message', async (msg) => {
  console.log('зашли в месаже');
  console.log(msg.chat.username + '  ' + msg.text );
  let text = msg.text
  let chatId = msg.chat.id
  let user = msg.chat.username
  // let keyboardStart = [
  //   [
  //     {
  //       text: 'Мои задачи', 
  //       callback_data: 'dutyList' // данные для обработчика событий
  //     }
  //   ],
  //   [
  //     {
  //       text: 'Добавить задачу',
  //       callback_data: 'addDuty'
  //     }
  //   ],
  //   [
  //     {
  //       text: 'Посмотреть мою статистику',
  //       callback_data: 'sendStat',
  //       url: '' //внешняя ссылка
  //     }
  //   ]
  // ];
  
  if (text == '/start') {
    bot.sendMessage(chatId, 'Привет!');
    let check_user = await get_User(user)

    if (!check_user) {
      return bot.sendMessage(chatId, 'Чтобы воспользоваться ботом, введите /register');
    } else {
      return bot.sendMessage(chatId, `С возвращением, ${msg.chat.username}!`, { 
        reply_markup: {
        inline_keyboard: keyboardStart
        }});
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
        keyboardStart = []
      default: message = 'что происходит?';
        keyboardStart = []
        break;
    }
    return bot.sendMessage(chatId, message, { 
      reply_markup: {
      inline_keyboard: keyboardStart
      }});
  }  
});
// 11011 пользователь уже зарегистирован 
// 12012 успешная регистрация
// 13013 ошибка при регистрации 

bot.on('callback_query', async (query) => {
  console.log('зашли в callback_query');
    const chatId = query.message.chat.id;
    let message = ''
    let keyboardDuties = [[]]
    let user_search
    try {
      user_search = await get_User(query.message.chat.username)
    } catch (err) {
      console.log(err);
    }
    if (user_search && user_search.user_tg_id == query.message.chat.username) {
      if (query.data === 'dutyList') { 
        let dutyList = await get_Duties(query.message.chat.username, user_search.id)
      
        if (dutyList.length) {
          message = 'Выберите задачу'
          dutyList.forEach(el => {
            keyboardDuties.push([{
              text: el.duty_name,
              callback_data: el.id
            }])
          });
        } else {
          message = 'У вас еще нет задач. Добавим?'
          keyboardDuties = [
            [{
              text: 'Добавить задачу',
              callback_data: 'addDuty'
            }]
          ]
        }
        bot.sendMessage(chatId, message, {
          reply_markup: {
            inline_keyboard: keyboardDuties
          }
        })
      }
      if (query.data === 'addDuty') { 
        console.log('зашли в addDuty');
        bot.sendMessage(chatId, 'введите название задачи')
        console.log('попросили ввести название');
        bot.on('message', async (msg) => {
          console.log('отправили запрос на добавление');
          let newDuty = await add_Duty(query.message.chat.username, user_search.id, msg.text)
          console.log('добавили задачу');
          if (newDuty) {
            bot.sendMessage(chatId, `Вы добавили задачу "${newDuty.duty_name}"`, {
              reply_markup: {
                inline_keyboard: keyboardStart
              }
            })
          }
        })
      }
      if (query.data === 'sendStat') { 
        console.log('addTask');
       
        // let myStat = await get_Stat(query.message.chat.username)
      }
    }
  });


