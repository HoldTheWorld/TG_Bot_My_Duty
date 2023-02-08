import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
dotenv.config()
const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});

import { req_get_User, req_reg_User, req_get_Duties, req_add_Duty, req_del_Duty } from "./reqFunctions.js"
// import { help_add_Duty } from "./helpFunctions.js"

let keyboardStart = [
  [
    {
      id: 'dutyList',
      text: 'Мои задачи', 
      callback_data: 'dutyList' // данные для обработчика событий
    }
  ],
  [
    {
      id: 'addDuty',
      text: 'Добавить задачу',
      callback_data: 'addDuty'
    }
  ],
  [
    {
      id: 'sendStat',
      text: 'Посмотреть мою статистику',
      callback_data: 'sendStat',
      url: '' //внешняя ссылка
    }
  ]
];
let keyboardYesNoAddDuty = [
  [
    {
      text: 'Да',
      callback_data: 'yesAddDuty'
    }
  ],
  [
    {
      text: 'Нет',
      callback_data: 'noAddDuty'
    }
  ]
]
bot.setMyCommands([
  {command: '/start' , description: 'старт'},
  {command: '/register' , description: 'регистрация'},
  {command: '/menu' , description: 'меню'}
  // {command: '/addduty' , description: 'добавить задачу'},
  // {command: '/deleteduty' , description: 'удалить задачу'},
  // {command: '/showduties' , description: 'показать мои задачи'},
  // {command: '/startduty' , description: 'начать выполнение задачи'},
  // {command: '/stopduty' , description: 'закончить выполнение задачи'},
  // {command: '/showstat' , description: 'показать статистику'},
  // {command: '/deleteme' , description: 'удалить свой профиль,задачи,статистику'}
])

   bot.on('text', async (msg) => {
    console.log('зашли в text');
    console.log(msg.chat.username + '  ' + msg.text );
    let text = msg.text
    let chatId = msg.chat.id
    let userTdId = msg.chat.username
    let checkUser
    let message

    try {
      checkUser = await req_get_User(userTdId)
      console.log('нашли пользователя: ' + checkUser[0].user_tg_id );
      } catch (err) {
        console.log(err);
      }

    if (text == '/start' || text == '/menu') {
      // bot.sendMessage(chatId, 'Привет!');
      // let checkUser = await req_get_User(userTdId)
      if (!checkUser.length) {
        return bot.sendMessage(chatId, 'Чтобы воспользоваться ботом, введите /register');
      } else if (checkUser.length && checkUser[0].user_tg_id == userTdId) {
        return bot.sendMessage(chatId, `Чего желаете, ${userTdId}?`, { 
          reply_markup: {
          inline_keyboard: keyboardStart
          }});
      }
    }
    if (text == '/register') {
      // let message = 'empty message'
      if (!checkUser.length) {
        let regResult = await req_reg_User(userTdId)
        if (regResult) {
          message = 'вы успешно зарегистрированы';
        } else {
          message = 'ошибка регистрации';
          keyboardStart = []
        }
      } else if (checkUser.length && checkUser[0].user_tg_id == userTdId) {
        message = 'вы уже зарегистрированы'; 
      } else {
        message = 'что происходит?';
        keyboardStart = []
      }
    
      return bot.sendMessage(chatId, message, { 
        reply_markup: {
        inline_keyboard: keyboardStart
        }});

    }  else if (text.toLowerCase().indexOf('я буду') == 0) {
      console.log('ща добавим задачу ' + msg.text.slice(7));
      let newDuty = await req_add_Duty(userTdId, checkUser[0].id, msg.text.slice(7))
      if (newDuty) {
        message = `Вы добавили задачу "${newDuty.duty_name}"`
      } else {
        message = 'не удалось добавить задачу, попробуйте снова'
      }
      bot.sendMessage(chatId, message, { 
        reply_markup: {
        inline_keyboard: keyboardStart
        }})
    } else if (text.toLowerCase().indexOf('я буду') > 0) {
      bot.sendMessage(chatId, 'Начни со слов "Я буду" ')
    } else if (text.toLowerCase().indexOf('я буду') < 0) {
      bot.sendMessage(chatId, 'что вы хотите сделать?', { 
        reply_markup: {
        inline_keyboard: keyboardStart
        }})
    }
  });


bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  let userTdId = query.message.chat.username

  let message = ''
  let keyboardDuties = [[]]
  let checkUser
  try {
    checkUser = await req_get_User(userTdId)
    } catch (err) {
      console.log(err);
    }
    if (checkUser.length && checkUser[0].user_tg_id == userTdId) {
      if (query.data === 'dutyList') { 
        let dutyList = await req_get_Duties(userTdId, checkUser[0].id)
        console.log(dutyList);
        if (dutyList && dutyList.length) {
          message = 'Выберите задачу'
          dutyList.forEach(el => {
            keyboardDuties.push([{
              id: `${el.id}+${el.duty_name}`,
              text: el.duty_name,
              callback_data: `chosen:${el.id}`
            }])
          });
        } else {
          message = 'У вас еще нет задач. Добавим?'
          keyboardDuties = [
            [{
              id: 'addDuty',
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
        await bot.answerCallbackQuery(query.id, {
          show_alert: false
        })
      }
      if (query.data === 'addDuty') { 
        bot.sendMessage(chatId, 'Введите название задачи. Начните со слов "Я буду", например "Я буду играть на гитаре"')
       
        await bot.answerCallbackQuery(query.id, {
          show_alert: false
          })
      }
      if (query.data.indexOf('chosen', 0) == 0) {
        // console.log(Number(query.data.slice(7)));
        let keyboardDutiesActions = [
          [{
            id: 'delDuty',
            text: 'Удалить задачу',
            callback_data: `delDuty${Number(query.data.slice(7))}`
            }],
          [{
            id: 'strDuty',
            text: 'Начать выполнять задачу',
            callback_data: `strDuty${Number(query.data.slice(7))}`
            }],
          [{
            id: 'finDuty',
            text: 'Закончить выполнение задачи',
            callback_data: `finDuty${Number(query.data.slice(7))}`
            }],
          [{
            id: 'sttDuty',
            text: 'Посмотреть статистику задачи',
            callback_data: `sttDuty${Number(query.data.slice(7))}`
            }]
        ]
        bot.sendMessage(chatId, 'что вы хотите сделать?', {
          reply_markup: {
            inline_keyboard: keyboardDutiesActions
          }
        })
        await bot.answerCallbackQuery(query.id, {
          show_alert: false
        })
      }

      if (query.data.indexOf('delDuty',0) == 0) {
        console.log('delete');
        let response = await req_del_Duty(Number(query.data.slice(7)))

        if (response) {

          message = 'Задача бесследно удалена'
          } else {
          message = 'что-то пошло не так'
          keyboardStart = []
        }
        bot.sendMessage(chatId, message, { 
          reply_markup: {
          inline_keyboard: keyboardStart
          }})

        await bot.answerCallbackQuery(query.id, {
          show_alert: false
        })
      }

      if (query.data.indexOf('strDuty',0) == 0) {
        // console.log(Number(query.data.slice(7)));

        bot.sendMessage(chatId, 'эта опция еще не готова', { 
          reply_markup: {
          inline_keyboard: keyboardStart
          }})
      }

      if (query.data.indexOf('finDuty',0) == 0) {
        // console.log(Number(query.data.slice(7)));
        bot.sendMessage(chatId, 'эта опция еще не готова', { 
          reply_markup: {
          inline_keyboard: keyboardStart
          }})
      }

      if (query.data.indexOf('sttDuty',0) == 0) {
        // console.log(Number(query.data.slice(7)));
        bot.sendMessage(chatId, 'эта опция еще не готова', { 
          reply_markup: {
          inline_keyboard: keyboardStart
          }})
      }


      if (query.data === 'sendStat') { 
        // console.log('sendStat');
       
        // let myStat = await get_Stat(query.message.chat.username)
        bot.sendMessage(chatId, 'эта опция еще не готова', { 
          reply_markup: {
          inline_keyboard: keyboardStart
          }})
      }
    }

    // await bot.answerCallbackQuery(query.id, {
    //   show_alert: false
    //   })

  });
  



  // export {bot}
  
  
  //  bot.on('message', async (msg) => {
  //   console.log('зашли в месаже');
  //   console.log(msg.chat.username + '  ' + msg.text );
  //   let text = msg.text
  //   let chatId = msg.chat.id
  //   let user = msg.chat.username
  //   // let keyboardStart = [
  //   //   [
  //   //     {
  //   //       text: 'Мои задачи', 
  //   //       callback_data: 'dutyList' // данные для обработчика событий
  //   //     }
  //   //   ],
  //   //   [
  //   //     {
  //   //       text: 'Добавить задачу',
  //   //       callback_data: 'addDuty'
  //   //     }
  //   //   ],
  //   //   [
  //   //     {
  //   //       text: 'Посмотреть мою статистику',
  //   //       callback_data: 'sendStat',
  //   //       url: '' //внешняя ссылка
  //   //     }
  //   //   ]
  //   // ];
    
  //   if (text == '/start') {
  //     bot.sendMessage(chatId, 'Привет!');
  //     let check_user = await get_User(user)
  
  //     if (!check_user) {
  //       return bot.sendMessage(chatId, 'Чтобы воспользоваться ботом, введите /register');
  //     } else {
  //       return bot.sendMessage(chatId, `С возвращением, ${msg.chat.username}!`, { 
  //         reply_markup: {
  //         inline_keyboard: keyboardStart
  //         }});
  //     }
  //   }
  //   if (text == '/register') {
  //     let reg_result = await reg_User(user)
  //     let message = 'empty message'
  //     switch (reg_result) {
  //       case 11011: message = 'вы уже зарегистрированы';
  //         break;
  //       case 12012: message = 'вы успешно зарегистрированы';
  //         break;
  //       case 13013: message = 'ошибка регистрации'
  //         keyboardStart = []
  //       default: message = 'что происходит?';
  //         keyboardStart = []
  //         break;
  //     }
  //     return bot.sendMessage(chatId, message, { 
  //       reply_markup: {
  //       inline_keyboard: keyboardStart
  //       }});
  //   }  
  // });
