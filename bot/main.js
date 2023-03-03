import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
import moment from 'moment/moment.js'
dotenv.config()
const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});

import { req_get_User, req_reg_User, req_get_Duties, req_add_Duty, req_del_Duty, req_add_Timing, req_fin_Timing, req_getOne_Duty, req_check_Active, req_get_One_Timing } from "./reqFunctions.js"

import { getDutyMenu, getOneStat, getStatMenu, getTimeString } from './helpFunctions.js'

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
      id: 'sttDuty',
      text: 'Посмотреть мою статистику',
      callback_data: 'sttDuty'
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
// moment.locale('ru')
   bot.on('text', async (msg) => {
    // console.log('зашли в text');
    // console.log(msg.chat.username + '  ' + msg.text );
    let text = msg.text
    let chatId = msg.chat.id
    let userTdId = msg.chat.username
    let checkUser
    let message
    try {
      checkUser = await req_get_User(userTdId)
      // console.log('нашли пользователя: ' + checkUser[0].user_tg_id );
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
      // console.log('ща добавим задачу ' + msg.text.slice(7));
     if (!msg.text.slice(7).trim().length) {
      message = 'Вы ввели пустое название. Зачем?('
     } else {
        let newDuty = await req_add_Duty(userTdId, checkUser[0].id, msg.text.slice(7))
        if (newDuty) {
          message = `Вы добавили задачу "${newDuty.duty_name}"`
        } else {
          message = 'не удалось добавить задачу, попробуйте снова'
        }
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
    console.log(query.message.date);
    console.log(Date.now());
    } catch (err) {
      console.log(err);
    }

    if (checkUser.length && checkUser[0].user_tg_id == userTdId) {
      // список задач 
      if (query.data === 'dutyList') { 
        let dutyList = await req_get_Duties(userTdId, checkUser[0].id)
        // console.log(dutyList);
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
      // добавление задач 
      if (query.data === 'addDuty') { 
        bot.sendMessage(chatId, 'Введите название задачи. Начните со слов "Я буду", например "Я буду играть на гитаре"')
       
        await bot.answerCallbackQuery(query.id, {
          show_alert: false
          })
      }
      // выбор конкретной задачи 
      if (query.data.indexOf('chosen', 0) == 0) {
        // let chosenDuty = await req_get_One_Timing(query.data.slice(7))
        // let dutyName = chosenDuty[0].dutyname
        // console.log(chosenDuty[0].dutyname);
        // console.log(Number(query.data.slice(7)));
        let keyboardDutiesActions = await getDutyMenu(query.data.slice(7))
        // console.log(keyboardDutiesActions);
        // let keyboardDutiesActions = [
        //   [{
        //     id: 'delDuty',
        //     text: `Удалить задачу "${dutyName}"`,
        //     callback_data: `delDuty${Number(query.data.slice(7))}`
        //     }],
        //   [{
        //     id: 'strDuty',
        //     text: `Начать выполнять задачу "${dutyName}"`,
        //     callback_data: `strDuty${Number(query.data.slice(7))}`
        //     }],
        //   [{
        //     id: 'finDuty',
        //     text: `Закончить выполнение задачи "${dutyName}"`,
        //     callback_data: `finDuty${Number(query.data.slice(7))}`
        //     }],
        //   [{
        //     id: 'sttDuty',
        //     text: `Посмотреть статистику задачи "${dutyName}"`,
        //     callback_data: `sttDuty${Number(query.data.slice(7))}`
        //     }]
        // ]
        bot.sendMessage(chatId, `что вы хотите сделать?`, {
          reply_markup: {
            inline_keyboard: keyboardDutiesActions
          }
        })
        await bot.answerCallbackQuery(query.id, {
          show_alert: false
        })
      }
      // удаление задачи 
      if (query.data.indexOf('delDuty',0) == 0) {
        // console.log('delete');
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
      // начать выполнение задачи 
      if (query.data.indexOf('strDuty',0) == 0) {
        let message = ''
        let keyBoard = []

        const responseCheck = await req_check_Active(checkUser[0].id)
        // console.log(responseCheck);
        if (!responseCheck.length) {
          // console.log('зашли в начало задачи');
          // if no active, start a new one 
          let date = Date.now();
          let result = await req_add_Timing(Number(query.data.slice(7)), date)
          let thisDuty = await req_getOne_Duty(Number(query.data.slice(7)))
          if (result && thisDuty.length) {
              message = `Вы начали выполнение задачи "${thisDuty[0].duty_name}"  ${moment().format('LL')}  в  ${moment().format('LTS')}`
          } else {
            message = 'что-то пошло не так'
          }
          keyBoard = await getDutyMenu(query.data.slice(7))
        } else {
          let {hours, minutes} =  getTimeString((Date.now() - responseCheck[0].dutystart))
        //  let hours = Math.floor((Date.now() - responseCheck[0].dutystart)/3600000)
        //  let minutes = (Math.floor((Date.now() - responseCheck[0].dutystart)/60000)) - hours*60
          message = `
          сначала завершите задачу "${responseCheck[0].dutyname}", начатую ${hours} час(-ов) ${minutes} минут назад
          `
          keyBoard = await getDutyMenu(responseCheck[0].dutyid.toString())
        }
        bot.sendMessage(chatId, message, { 
          reply_markup: {
          inline_keyboard: keyBoard
          }})

        await bot.answerCallbackQuery(query.id, {
            show_alert: false
          })
      }
      // закончить задачу
      if (query.data.indexOf('finDuty',0) == 0) {
        let message = ''
        let keyBoard = []
        let date = Date.now();
        const activeDuties = await req_check_Active(checkUser[0].id)
        if (!activeDuties.length) {
          message = 'у вас нет активных задач'
          keyBoard = await getDutyMenu(query.data.slice(7))
        } else {
          if (activeDuties[0].dutyid ==  Number(query.data.slice(7))) {
            console.log(activeDuties);
            let result = await req_fin_Timing(activeDuties[0].timingid, date)
            if (result) {
              message = `
              Вы закончили выполнение задачи "${activeDuties[0].dutyname}"  ${moment().format('LL')}  в  ${moment().format('LTS')}
              `
              } else {
                message = 'что-то пошло не так'
            }
            keyBoard = keyboardStart
          } else {
            message = `сначала завершите выполнение задачи "${activeDuties[0].dutyname}"`
            keyBoard = await getDutyMenu(activeDuties[0].dutyid.toString())
          }
        }
        bot.sendMessage(chatId, message, { 
          reply_markup: {
          inline_keyboard: keyBoard
          }})
        await bot.answerCallbackQuery(query.id, {
            show_alert: false
          })
      }
      // статистика по задаче 
      if (query.data.indexOf('sttDuty',0) == 0) {
        let keyBoardStat = getStatMenu(query.data.slice(7))
        bot.sendMessage(chatId, 'За какой период?', { 
          reply_markup: {
          inline_keyboard: keyBoardStat
          }})
        await bot.answerCallbackQuery(query.id, {
          show_alert: false
          })
      }
      if (query.data.indexOf('stat', 0) == 0) {
        let message = await getOneStat(checkUser[0].id, query.data.slice(4,5))
        bot.sendMessage(chatId, message )
        await bot.answerCallbackQuery(query.id, {
          show_alert: false
        })
      }
    }
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


      // console.log(msg.date.toString);
    // let newDate = Date.now()
    // console.log(newDate);
    // console.log(Date.UTC());
    // console.log(msg.date);
    // const date = new Date();
//     const date = msg.date;
// // console.log(moment().format());
// // console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
// console.log(date.toLocaleString('ru-RU', {
//   year: 'numeric',
//   month: 'numeric',
//   day: 'numeric',
//   hour: '2-digit',
//   minute: '2-digit',
//   second: '2-digit'

// }));
// console.log(moment().format('l') + ' ' + moment().format('LT'));
// console.log(`${date.getDate()}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`);
