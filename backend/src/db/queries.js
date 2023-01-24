const db = require('./db/connection');

async function view1() {
  try {
    const [seeMore] = await db.query(`
    SELECT races.name, races.location FROM races
    JOIN entries ON races.id = entries.race_id
    JOIN jockeys ON entries.jockey_id = jockeys.id
    WHERE jockeys.name LIKE 'Chanel Rojas';
    `)
    console.log(seeMore);
  } catch(err) {
    console.log(err);
  }
}

async function view2() {
  try {
    const [seeMore] = await db.query(`
    SELECT races.name AS race_name, jockeys.name AS jockey_name, horses.name AS horse_name
    FROM races
    INNER JOIN entries ON races.id = entries.race_id
    INNER JOIN jockeys ON entries.jockey_id = jockeys.id
    INNER JOIN horses ON entries.horse_id = horses.id
    WHERE races.id = 3
    `)
    console.log(seeMore);
  } catch(err) {
    console.log(err);мо
  }
}

async function view3() {
  try {
    const [seeMore] = await db.query(`
    SELECT races.name, races.location FROM races
    INNER JOIN entries ON races.id = entries.race_id
    INNER JOIN horses ON entries.horse_id = horses.id
    WHERE horses.id = 2;
    `)
    console.log(seeMore);
  } catch(err) {
    console.log(err);
  }
}

async function view4() {
  try {
    const [seeMore] = await db.query(`
    SELECT jockeys.name FROM jockeys
    INNER JOIN entries ON jockeys.id = entries.jockey_id
    INNER JOIN horses ON entries.horse_id = horses.id
    WHERE horses.id = 2;
    `)
    console.log(seeMore);
  } catch(err) {
    console.log(err);
  }
}

async function view5() {
  try {
    const [seeMore] = await db.query(`
    SELECT races.name, races.location FROM races
    INNER JOIN entries ON races.id = entries.race_id
    INNER JOIN jockeys ON jockeys.id = entries.jockey_id
    WHERE jockeys.id = 8;
  
    `)
    console.log(seeMore);
  } catch(err) {
    console.log(err);
  }
}
// view5()

async function showJockeys() {
  try {
    const [result] = await db.query(`
    SELECT * FROM jockeys
    `)
    console.log(result);
  }catch(err) {
    console.log(err);
  }
}

// showJockeys()

async function showMe() {
  try {
    const [result] = await db.query(`
    select horses.name as horse_name, horses.breed as horse_breed from horses 
    inner join entries on entries.horse_id = horses.id
    inner join races on entries.race_id = races.id
    where races.location = 'Dno'
    `)
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

// showMe()
