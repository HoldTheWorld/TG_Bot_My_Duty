import db from './connectDB.js';

async function createTables() {
  try {
    await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      user_tg_id VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS duties (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
      task_name VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS timings (
      id SERIAL PRIMARY KEY,
      task_id INTEGER REFERENCES duties (id) ON DELETE CASCADE,
      start_date VARCHAR(40) NOT NULL,
      finish_date VARCHAR(40) NOT NULL
    );

    `)
  } catch(err)
 {
   console.log(err);
 }
}

 createTables();


 
//  async function add() {
//   await query(`
//   ALTER TABLE table_name alter column column_name type integer;
//   `)
// }
// add();
