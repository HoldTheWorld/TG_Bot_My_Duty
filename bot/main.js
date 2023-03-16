import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
dotenv.config()
const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});
import { req_get_User, req_reg_User, req_get_Duties, req_add_Duty, req_del_Duty, req_add_Timing, req_fin_Timing, req_getOne_Duty, req_check_Active, req_get_One_Timing, upd_timeZone } from "./reqFunctions.js"
import { getDutyMenu, getOneStat, getStatMenu, getTimeString, getUserTime, getTimeZone  } from './helpFunctions.js'

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
      callback_data: 'sttDuty',
    }
  ],
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
  {command: '/menu' , description: 'меню'},
])

  bot.on('text', async (msg) => {
    let text = msg.text
    let chatId = msg.chat.id
    let userTdId = msg.chat.username
    let checkUser
    let message = ''
    let keyBoard = [[]]
    try {
      checkUser = await req_get_User(userTdId)
    } catch (err) {
        console.log(err);
    }

    if (text == '/start' || text == '/menu') {
      // bot.sendMessage(chatId, 'Привет!');
      // let checkUser = await req_get_User(userTdId)
      if (!checkUser.length) {
        message = 'Чтобы воспользоваться ботом, введите /register'
        // return bot.sendMessage(chatId, 'Чтобы воспользоваться ботом, введите /register');
      } else if (checkUser.length && checkUser[0].user_tg_id == userTdId) {
        message = `Чего желаете, ${userTdId}?`
        keyBoard = keyboardStart
        // return bot.sendMessage(chatId, `Чего желаете, ${userTdId}?`, { 
        //   reply_markup: {
        //   inline_keyboard: keyboardStart
        // }});
      }
      
    } else if (text == '/register') {
      if (!checkUser.length) {
        let regResult = await req_reg_User(userTdId)
        if (regResult) {
          message = `Вы успешно зарегистрированы\n`;
          message += `
          🚀 Введи /start или /menu, чтобы начать работу. 
          🚀 Для быстрого добавления задачи введи: Я буду {название задачи}.
          ⚠️ Для корректного учета времени тебе необходимо поделиться с ботом геопозицией: боту нужна только твоя временная зона, поэтому ты просто можешь выбрать ближайших город, находящийся в том же часовом поясе, что и ты. 
          Ты можешь сменить геопозицию в любое время, но все ранее учтенные задачи будут оставаться в том часовом поясе, в котором они были созданы. 
          Чтобы установить/сменить геопозицию:
          нажми на скрепку 📎 - местоположение  🚩- и выбери точку на карте 📍.
          Если не выбрать геопозицию, по умолчанию будет выбрана временна зона в Москве (+3 часа UTC).`
          // keyBoard = keyboardStart
        } else {
          message = 'Ошибка регистрации';
          // keyboardStart = []
        }
      } else if (checkUser.length && checkUser[0].user_tg_id == userTdId) {
        message = 'вы уже зарегистрированы'; 
        keyBoard = keyboardStart
      } else {
        message = 'что происходит?';
        // keyboardStart = []
      }
  
      // return bot.sendMessage(chatId, message, { 
      //   reply_markup: {
      //   inline_keyboard: keyboardStart
      //   }});
    }  else if (text.toLowerCase().indexOf('я буду') == 0 && checkUser.length) {
      
      if (!msg.text.slice(7).trim().length) {
      message = 'Вы ввели пустое название. Попробуйте ввести НЕ пустое.'
      } else {
        let newDuty = await req_add_Duty(userTdId, checkUser[0].id, msg.text.slice(7))
        if (newDuty) {
          message = `Вы добавили задачу "${newDuty.duty_name}"`
          keyBoard = keyboardStart
        } else {
          message = 'не удалось добавить задачу, попробуйте снова'
          keyBoard = keyboardStart
        }
      }
      // bot.sendMessage(chatId, message, { 
      //   reply_markup: {
      //   inline_keyboard: keyboardStart
      //   }})
    } else if (msg.text.toLowerCase().indexOf('я буду') > 0 && checkUser.length ) {
      message = 'Начни со слов "Я буду" '
      // bot.sendMessage(chatId, 'Начни со слов "Я буду" ')
    } else {
      message =  'что вы хотите сделать?'
      keyBoard = keyboardStart
      // bot.sendMessage(chatId, 'что вы хотите сделать?', { 
      //   reply_markup: {
      //   inline_keyboard: keyboardStart
      //   }})
    } 
    bot.sendMessage(chatId, message, { 
      reply_markup: {
      inline_keyboard: keyBoard
      }});
  });

bot.on('location', async (query) => {
  const userTdId = query.chat.username
  const chatId = query.chat.id;
  let message = ''
  let keyBoard = [[]]
  let checkUser
  checkUser = await req_get_User(userTdId)
  if (checkUser.length && checkUser[0].user_tg_id == userTdId)  {
    let {timeZone, temp} = await getTimeZone(query.location.latitude, query.location.longitude)
    let updResult = await upd_timeZone(query.chat.username, timeZone)
    if (updResult == 1 ) {
      message = `Установлена временная зона: "UTC/GMT ${timeZone/3600} hours"`
    } else {
      message = 'что-то пошло не так'
    }
  } else {
    message = 'Чтобы воспользоваться ботом, введите /register'
  }
  bot.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: keyBoard
    }
  })
})  

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  let userTdId = query.message.chat.username
  let message = ''
  let timeZoneMs
  let keyboardDuties = [[]]
  let checkUser
  try {
    checkUser = await req_get_User(userTdId)
  } catch (err) {
    console.log(err);
  }
  
  if (checkUser.length && checkUser[0].user_tg_id == userTdId) {
      timeZoneMs = checkUser[0].time_zone * 1000
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
        let keyboardDutiesActions = await getDutyMenu(query.data.slice(7))
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
        let responseCheck = await req_check_Active(checkUser[0].id)
        if (!responseCheck.length) {
          let date = Date.now() + timeZoneMs
          let result = await req_add_Timing(Number(query.data.slice(7)), date)
          let thisDuty = await req_getOne_Duty(Number(query.data.slice(7)))
          if (result && thisDuty.length) {
              message = `Вы начали выполнение задачи "${thisDuty[0].duty_name}": ${getUserTime(date)} `
          } else {
            message = 'что-то пошло не так'
          }
          keyBoard = await getDutyMenu(query.data.slice(7))
        } else {
          let {hours, minutes} =  getTimeString((Date.now() + timeZoneMs - responseCheck[0].dutystart))
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
        let date = Date.now() + timeZoneMs
        const activeDuties = await req_check_Active(checkUser[0].id)
        if (!activeDuties.length) {
          message = 'у вас нет активных задач'
          keyBoard = await getDutyMenu(query.data.slice(7))
        } else {
          if (activeDuties[0].dutyid ==  Number(query.data.slice(7))) {
            // console.log(activeDuties);
            let result = await req_fin_Timing(activeDuties[0].timingid, date)
            if (result) {
              message = `
              Вы закончили выполнение задачи "${activeDuties[0].dutyname}"  ${getUserTime(date)}
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
  
bot.on("polling_error", console.log);

  
