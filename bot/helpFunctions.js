import fetch from "node-fetch";
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import {req_get_One_Timing, req_getOne_Duty} from './reqFunctions.js'


const getDutyMenu = async function(dutyId) {
  let chosenDuty = await req_getOne_Duty(dutyId)
  console.log(chosenDuty);
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
    [{
      id: 'sttDuty',
      text: `Посмотреть статистику задачи "${dutyName}"`,
      callback_data: `sttDuty${Number(dutyId)}`
      }]
  ]

  return keyboardDutiesActions
}


export { getDutyMenu }
