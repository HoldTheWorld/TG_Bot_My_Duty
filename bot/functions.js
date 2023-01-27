import fetch from "node-fetch";
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const get_User = async function(userId) {
  // console.log(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/users`);
  try {
      console.log('START request '+userId)
      const response = await fetch(`http://${process.env.DB_HOST}:${process.env.DB_PORT}/users`, {
       credentials: 'include',
     })
     const userList = await response.json()
     console.log('user LIST '+userList);
     const target_user = userList.find((el) => el.user_tg_id === userId)
     console.log('TARGET USER'+target_user)
     return target_user
    } catch (err) {
      console.log(err);
    }
}

const reg_User = async function(userId) {
  let user_search = await get_User(userId)

  if (user_search) {
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

export { get_User, reg_User }

