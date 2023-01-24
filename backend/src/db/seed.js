const db = require('./db/connection');
const randomProfile = require('random-profile-generator');
const petNames = require('pet-names');
const randomWords = require('random-words');

const createJockeys = (n) => {
  let jockArr = []; 
  for (let i = 0; i < n; i++) {
    jockArr.push([randomProfile.name()])
    
  }
  return jockArr
}
const people = createJockeys(10);
console.log(people);


const createHorses = (n) => {
  let horaseArr = []; 
  for (let i = 0; i < n; i++) {
    horaseArr.push([petNames.random()])
  }
  return horaseArr
}
const aminals = createHorses(10);
// console.log(aminals);

const horses = [
['My All' ,'Abtenauer'],
['Tiger' , 'Albanian horse'],
['Mooky', 'Boerperd'],
['Kissy Face', 'Campolina'],
['Baby Boo', 'Colorado Ranger'],
['Gangsta Baby', 'Czech Warmblood'],
['Prince Charming', 'Gelderland horse'],
['Snuggle Bunny' , 'Hungarian Warmblood'],
['Baby-Bugga-Boo', 'Kalmyk horse'],
['Kit Kat', 'Karachai horse']
];

const races = [
  ['fish needs', 'Dno'],
  ['carefully depth', 'Ivanovo'],
  ['standard pain', 'Norilsk'],
  ['cut disease', 'Kurgan'],
  ['final church', 'Electrougli'],
];

const entries = [
  [1, 1 ,1],
  [2, 5, 3],
   [3, 2, 2], 
   [3, 4, 6],
   [4, 8, 9],
   [5, 10, 7],
   [3, 5, 2]

]

const createRaces = (n) => {
  let racesArr = randomWords({exactly: n, wordsPerString: 2});
  let arr = racesArr.map((el) => [el]);
  return arr
}
const games = createRaces(10);
// console.log(games);

const addJockeys = async () => {
  try {
    db.query(`
    INSERT INTO jockeys (name) VALUES ?;
    `, {
      replacements: [people]
    })

  } catch (err) {
    console.log(err);
  }
}

// addJockeys(); 


const addHorses = async () => {
  try {
    db.query(`
    INSERT INTO horses (name, breed) VALUES ?;
    `, {
      replacements: [horses]
    })

  } catch (err) {
    console.log(err);
  }
}

// addHorses(); 


const addRaces = async () => {
  try {
    db.query(`
    INSERT INTO races (name, location) VALUES ?;
    `, {
      replacements: [races]
    })

  } catch (err) {
    console.log(err);
  }
}

// addRaces(); 


const addEntries = async () => {
  try {
    db.query(`
    INSERT INTO entries (race_id, jockey_id, horse_id) VALUES ?;
    `, {
      replacements: [entries]
    })

  } catch (err) {
    console.log(err);
  }
}

// addEntries(); 
