import fetch from "node-fetch";
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const req_get_User = async function(userId) {
  // console.log(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/users`);
  try {
      console.log('START request '+userId)
      const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/users/${userId}`, {
       credentials: 'include',
     })
     const userResult = await response.json()
     console.log('user LIST '+userResult);
    //  const target_user = userList.find((el) => el.user_tg_id === userId)
    //  console.log('TARGET USER'+target_user)
    console.log(userResult);
     return userResult
    } catch (err) {
      console.log(err);
    }
}

const req_reg_User = async function(userId) {
  let user_search = await req_get_User(userId)

  if (user_search.length) {
    return 11011
  } else {
    try { 
      console.log('try to post');
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
         if (response.ok) {
          return 12012
         } else {
          return 13013
         }
      } catch(err) {
        return new Error('ошибка добавления контакта')
      }
  }
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

export { req_get_User, req_reg_User, req_get_Duties, req_add_Duty }

