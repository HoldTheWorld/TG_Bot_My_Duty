import fetch from "node-fetch";
import { log } from 'node:console';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const req_get_User = async function(userId) {
  let result = {
    isOk: true, 
    user: []
  }
  try {
      const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/users/${userId}`, {
       credentials: 'include',
     })
    const userResult = await response.json()
    result.isOk = true
    result.user = userResult
    } catch (err) {
      console.log(err);
      result.isOk = false
    }
    return result
}

const upd_timeZone = async function(userId, timeZone) {
  let result = {
    isOk: true,
    updated: []
  }
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/users/settimezone`, {
      method: 'POST', 
      credentials: 'include',
      headers: {
       'Content-Type': 'application/json',
       },
       body: JSON.stringify({ 
         user_tg_id: userId, 
         time_zone: timeZone
       })
    })
    result.isOk = true
    result.updated = await response.json()
  } catch(err) {
    console.log(err);
    result.isOk = false
  }
  return result
}

const req_reg_User = async function(userId) {
  let result = {
    isOk: true, 
    isNew: true
  }
    try { 
      const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/users/register`, {
           method: 'POST', 
           credentials: 'include',
           headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              user_tg_id: userId
            })
         })
         result.isOk = await response.json()
         result.isNew = response.ok
      } catch(err) {
        console.log(new Error('Error in register fetch'));
        result.isOk = false
      }
    return result
}

const req_get_Duties = async function(userId, id) {
  let result = {
    isOk: true,
    duties: []
  }
    try {
      const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/duties/get/${id}`, {
        method: 'GET', 
        credentials: 'include',
     })
     result.duties = await response.json()
     result.isOk = true
    } catch (err) {
      console.log(err);
      result.isOk = false
    }
    return result
}

const req_add_Duty = async function(userId, id, dutyName) {
  let result = {
    isOk: true,
    duty: []
  }
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/duties`, {
      method: 'POST', 
      credentials: 'include',
      headers: {
       'Content-Type': 'application/json',
       },
       body: JSON.stringify({ 
         user_id: id,
         duty_name: dutyName
       })
    })
    result.isOk = true
    result.duty = await response.json()
  } catch(err) {
    console.log(err);
    result.isOk = false
  }
  return result
}

const req_del_Duty = async function(dutyId) {
  let result = true
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/duties/delete/${dutyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    result = response.ok
  } catch(err) {
    console.log(err);
    result = false
  }
  return result
}

const req_getOne_Duty = async function(dutyId) {
  let result = {
    isOk: true,
    duty: []
  }
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/duties/getOne/${dutyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    result.duty = await response.json()
    result.isOk = true
  } catch(err) {
    console.log(err);
    result.isOk = false
  }
  return result
}

const req_add_Timing = async function(dutyId, start) {
  let result = {
    isOk: true,
    timing: []
  }
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/timings/start`, {
      method: 'POST', 
      credentials: 'include',
      headers: {
       'Content-Type': 'application/json',
       },
       body: JSON.stringify({ 
         duty_id: dutyId,
         start: start
       })
    })
    result.isOk = true
    result.timing = await response.json()
  } catch(err) {
    console.log(err);
    result.isOk = false
  }
  return result
}

const req_fin_Timing = async function(timingId, finish) {
  let result = {
    isOk: true,
    finished: []
  }
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/timings/finish`, {
      method: 'POST', 
      credentials: 'include',
      headers: {
       'Content-Type': 'application/json',
       },
       body: JSON.stringify({ 
         id: timingId,
         finish: finish
       })
    })
    result.isOk = true
    result.finished = await response.json()
  } catch(err) {
    console.log(err);
    result.isOk = false
  }
  return result
}

const req_check_Active = async function(userId) {
  let result = {
    isOk: true,
    active: []
  }
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/timings/checkact/${userId}`, {
      // method: 'POST', 
      credentials: 'include',
      headers: {
       'Content-Type': 'application/json',
       },
    })
    result.active = await response.json()
    result.isOk = true
  } catch(err) {
    console.log(err);
    result.isOk = false
  }
  return result
}

const req_get_One_Timing = async function(userId) {
  let result = {
    isOk: true,
    timing: []
  }
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/timings/gettiming/${userId}`, {
      // method: 'POST', 
      credentials: 'include',
      headers: {
       'Content-Type': 'application/json',
       },
    })
    result.timing = await response.json()
    result.isOk = true
  } catch(err) {
    console.log(err);
    result.isOk = false
  }
  return result
}



export { req_get_User, req_reg_User, req_get_Duties, req_add_Duty, req_del_Duty, req_add_Timing, req_fin_Timing, req_getOne_Duty, req_check_Active, req_get_One_Timing, upd_timeZone }

