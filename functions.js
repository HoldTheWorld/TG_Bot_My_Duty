
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const get_User = async function(userId) {
  console.log(userId)
    try {
      const response = await fetch('http://localhost:3000/users', {
       credentials: 'include',
     })
     const userList = await response.json()
     const target_user = userList.find((el) => el.user_id === userId)
     console.log(target_user)
     return target_user
    } catch (err) {
      return new Error('no connection to db')
    }
}

const reg_User = async function(userId) {
  let user_search = await get_User(userId)
  console.log(user_search+'ssskskskskks')
  if (user_search) {
    return 11011
  } else {
    let id = Math.random().toString(36).substr(2, 5)
    try { 
      const response = await fetch('http://localhost:3000/users', {
           method: 'POST', 
           credentials: 'include',
           headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              id, userId
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

