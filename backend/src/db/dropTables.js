import db from './db/connectDB.js';

async function dropper () {
  await db.query(`
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS duties;
  DROP TABLE IF EXISTS timings;
  `)
}
// dropper();
