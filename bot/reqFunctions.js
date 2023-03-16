import fetch from "node-fetch";
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const req_get_User = async function(userId) {
  // console.log(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/users`);
  try {
      // console.log('START request '+userId)
      const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/users/${userId}`, {
       credentials: 'include',
     })
     const userResult = await response.json()
    //  console.log('user LIST '+userResult);
    //  const target_user = userList.find((el) => el.user_tg_id === userId)
    //  console.log('TARGET USER'+target_user)
    // console.log(userResult);
     return userResult
    } catch (err) {
      console.log(err);
    }
}

const upd_timeZone = async function(userId, timeZone) {

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
    const updCount = await response.json()
    return updCount[0]
  } catch(err) {
    console.log(err);
  }

}

const req_reg_User = async function(userId) {
  // let user_search = await req_get_User(userId)

  // if (user_search.length) {
  //   return 11011
  // } else {
    try { 
      // console.log('try to post');
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
        //  console.log(response.ok);
         return response.ok
      } catch(err) {
        return new Error('ошибка добавления контакта')
      }
  // }
}

const req_get_Duties = async function(userId, id) {
    try {
      const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/duties/get/${id}`, {
        method: 'GET', 
        credentials: 'include',
     })
     const dutyList = await response.json()
     return dutyList
    } catch (err) {
      console.log(err);
    }
    return null
}

const req_add_Duty = async function(userId, id, dutyName) {
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
    const newDuty = await response.json()
    return newDuty
  } catch(err) {
    console.log(err);
  }
}

const req_del_Duty = async function(dutyId) {
  try {
    // console.log('зашли в функцию удаления')
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/duties/delete/${dutyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    // console.log('ответ на удаление - ')
    return response.ok

  } catch(err) {
    console.log(err);
  }
}

const req_getOne_Duty = async function(dutyId) {
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/duties/getOne/${dutyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const oneDuty = await response.json()
    return oneDuty
  } catch(err) {
    console.log(err);
  }
}

const req_add_Timing = async function(dutyId, start) {
  // console.log(dutyId);
  // console.log(start);
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
    const newTiming = await response.json()
    return newTiming
  } catch(err) {
    console.log(err);
  }
}

const req_fin_Timing = async function(timingId, finish) {
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
    await response.json()
    return response.ok
  } catch(err) {
    console.log(err);
  }
}

const req_check_Active = async function(userId) {
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/timings/checkact/${userId}`, {
      // method: 'POST', 
      credentials: 'include',
      headers: {
       'Content-Type': 'application/json',
       },
      //  body: JSON.stringify(dutyList)
    })
    const result = await response.json()
    return result
 
  } catch(err) {
    console.log(err);
  }
}

const req_get_One_Timing = async function(userId) {
  console.log(userId);
  try {
    const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/timings/gettiming/${userId}`, {
      // method: 'POST', 
      credentials: 'include',
      headers: {
       'Content-Type': 'application/json',
       },

    })
    const result = await response.json()
    return result
 
  } catch(err) {
    console.log(err);
  }
}



export { req_get_User, req_reg_User, req_get_Duties, req_add_Duty, req_del_Duty, req_add_Timing, req_fin_Timing, req_getOne_Duty, req_check_Active, req_get_One_Timing, upd_timeZone }

