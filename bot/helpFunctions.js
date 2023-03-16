import fetch from "node-fetch";
import dns from 'node:dns';
import * as dotenv from 'dotenv'
dotenv.config()
import moment from 'moment/moment.js'
dns.setDefaultResultOrder('ipv4first');
import {req_get_One_Timing, req_getOne_Duty} from './reqFunctions.js'
import { log } from 'node:console';
const wToken = process.env.WEATHER_KEY

const getDutyMenu = async function(dutyId) {
  let chosenDuty = await req_getOne_Duty(dutyId)
  // console.log(chosenDuty);
  let dutyName = chosenDuty[0].duty_name
  let keyboardDutiesActions = [
    [{
      id: 'delDuty',
      text: `Удалить задачу "${dutyName}"`,
      callback_data: `delDuty${Number(dutyId)}`
      }],
    [{
      id: 'strDuty',
      text: `Начать выполнять задачу "${dutyName}"`,
      callback_data: `strDuty${Number(dutyId)}`
      }],
    [{
      id: 'finDuty',
      text: `Закончить выполнение задачи "${dutyName}"`,
      callback_data: `finDuty${Number(dutyId)}`
      }],
    // [{
    //   id: 'sttDuty',
    //   text: `Посмотреть статистику задачи "${dutyName}"`,
    //   callback_data: `sttDuty${Number(dutyId)}`
    //   }]
  ]
  return keyboardDutiesActions
}

const getStatMenu = function(dutyId) {

  let keyBoard = [
    [
      {
        text: 'Сегодня',
        callback_data: `statD${dutyId}`
      }
    ],
    [
      {
        text: 'Эта неделя',
        callback_data: `statW${dutyId}`
      }
    ],
    [
      {
        text: 'Этот месяц',
        callback_data: `statM${dutyId}`
      }
    ],
    [
      {
        text: 'Этот год',
        callback_data: `statY${dutyId}`
      }
    ],     
    // [
    //   {
    //     text: 'Вчера',
    //     callback_data: `statE${dutyId}`
    //   }
    // ],
    // [
    //   {
    //     text: 'Прошлая неделя',
    //     callback_data: `statL${dutyId}`
    //   }
    // ]
  ]
  return keyBoard
}
// dutyId , period - string 
const getOneStat = async function(userId, period) {
  console.log(userId);
  console.log(period);
  // let statTime = 0
  let startMoment
  let periodName
  // let endMoment
  let duties = []
  
  let reqStart = moment().valueOf()
  switch (period) {
    case 'D':
      startMoment = moment().hour(0).minute(0).seconds(0).valueOf() 
      periodName = 'Сегодня'
      break;
    case 'W':
      startMoment = moment().day(1).hour(0).minute(0).seconds(0).valueOf()
      periodName = 'На этой неделе'
      break;
    case 'M':
      startMoment = moment().date(1).hour(0).minute(0).seconds(0).valueOf() 
      periodName = 'В этом месяце'
      break;
    case 'Y':
      startMoment = moment().dayOfYear(1).hour(0).minute(0).seconds(0).valueOf() 
      periodName = 'В текущем году'
      break;
    // case 'E': // вчера
    //   startMoment = moment().dayOfYear(1).hour(0).minute(0).seconds(0).valueOf() 
    //   break;
    // case 'L': // на прошлой неделе
    //   startMoment = moment().dayOfYear(1).hour(0).minute(0).seconds(0).valueOf() 
    //   break;
    default: 
      startMoment = moment().hour(0).minute(0).seconds(0).valueOf() 
      break;
  }
  // console.log('start moment =====> '+startMoment);
  let date = Date.now();
  console.log("date yesterday ====>" + moment().hour(0).minute(0).seconds(0).subtract(1, 'days'));
  let message = `${periodName} Вы выполняли \n`
  let list = await req_get_One_Timing(userId)

  /*
  {
    id: id,
    name: name,
    duration: duration
  }
  */
 
  list.forEach(tim => {
    let ind = duties.findIndex(d => d.id == tim.dutyid)
    let statTime = 0
  // console.log(`===> task ${tim.dutyname} , start ${tim.dutystart}, end ${tim.dutyfinish} , start moment ${startMoment}`)
    if (tim.dutyfinish > startMoment ) {
      // console.log(`===> task ${tim.dutyname} taken into account`)
      if (tim.dutystart < startMoment) { // начало задачи в предыдущем периоде
          statTime = tim.dutyfinish - startMoment
      } else { // начало задачи в текущем периоде
        statTime = tim.dutyfinish - tim.dutystart
      }
    if (ind < 0) {
      // console.log( `===> task ${tim.dutyname} not added yet`)
      // console.log(`===> ${tim.dutyname} added to stat: ${statTime}`)
      duties.push({id: tim.dutyid, name: tim.dutyname, duration: statTime})
    } else {
      // console.log( `===> task ${tim.dutyname} WAS added already`)
      // console.log(`===> ${tim.dutyname} added to stat: ${statTime}`)
      duties[ind].duration = duties[ind].duration + statTime
    }
  }
  })
  duties.map(el => el.duration = getTimeString(el.duration) )
  duties.forEach(el => message += `задачу "${el.name}" ${el.duration.hours} ч. ${el.duration.minutes} мин.; \n`)
  // console.log(message);
 
  return message
}

const getTimeString = function(time) {
  let hours = Math.floor(time/3600000)
  let minutes = (Math.floor(time/60000)) - hours * 60
  let timeString = `${hours} час(-ов) ${minutes} минут`

  return { hours: hours, minutes : minutes}
}

const addLeadingZero = function(d) {
  return (d < 10) ? '0' + d : d
}
const days = ['Воскресенье', 'Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'] 
const getUserTime = function(time) {
  // console.log(time);
  let t = new Date(time)
  let Y = t.getFullYear()
  let M = addLeadingZero(t.getMonth() + 1 )
  let D = addLeadingZero(t.getDate())
  let d = days[t.getDay()]
  let h = addLeadingZero(t.getUTCHours())
  let m = addLeadingZero(t.getMinutes())

  return `${Y}.${M}.${D} ${h}:${m} (${d})`
}

const getTimeZone = async function(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${wToken}`, {
    credentials: 'include',
  })
  let result = await response.json()
  if (result.cod == 200) {
    let temp = result.main.temp
    let timeZone = result.timezone
    // console.log(result);
    return {timeZone: timeZone, temp: temp}
  } else {
    return {timeZone: 10800, temp: 0}
  }
}


export { getDutyMenu, getOneStat, getStatMenu, getTimeString, getUserTime, getTimeZone }
