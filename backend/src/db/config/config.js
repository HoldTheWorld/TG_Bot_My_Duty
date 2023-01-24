// migrations/config/config.js
import development from './database.js';

const env = process.env.NODE_ENV || 'development';

export default {
  [env]: {
        dialect: 'postgres',
        migrationStorageTableName: 'SequelizeMeta',
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST
      }
};
// migrations/config/config.js
// import config from '../../config/config.json';
// const env = process.env.NODE_ENV || 'development';

// export default {
//   [env]: {
//     dialect: config[env]['dialect'],
//     username: config[env]['username'],
//     password: config[env]['password'],
//     host: config[env]['host'],
//     migrationStorageTableName: 'SequelizeMeta'
//   }
// };
