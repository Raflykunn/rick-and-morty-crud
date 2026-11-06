const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const https = require('https');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(DB_PATH);

function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS characters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Alive',
          species TEXT NOT NULL DEFAULT 'Human',
          gender TEXT NOT NULL DEFAULT 'unknown',
          image TEXT DEFAULT ''
        )
      `, (err) => {
        if (err) return reject(err);

        db.get('SELECT COUNT(*) as count FROM characters', (countErr, row) => {
          if (countErr) return reject(countErr);

          if (row.count === 0) {
            seedFromRickAndMorty()
              .then(() => resolve(db))
              .catch(() => {
                seedLocalData().then(() => resolve(db)).catch(reject);
              });
          } else {
            resolve(db);
          }
        });
      });
    });
  });
}

function seedFromRickAndMorty() {
  return new Promise((resolve, reject) => {
    https.get('https://rickandmortyapi.com/api/character?page=1', (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const characters = (parsed.results || []).slice(0, 10);
          
          const stmt = db.prepare('INSERT INTO characters (name, status, species, gender, image) VALUES (?, ?, ?, ?, ?)');
          characters.forEach(c => {
            stmt.run(c.name, c.status, c.species, c.gender, c.image);
          });
          stmt.finalize((err) => {
            if (err) return reject(err);
            resolve();
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function seedLocalData() {
  const localList = [
    { name: 'Rick Sanchez', status: 'Alive', species: 'Human', gender: 'Male', image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg' },
    { name: 'Morty Smith', status: 'Alive', species: 'Human', gender: 'Male', image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg' },
    { name: 'Summer Smith', status: 'Alive', species: 'Human', gender: 'Female', image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg' },
    { name: 'Beth Smith', status: 'Alive', species: 'Human', gender: 'Female', image: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg' },
    { name: 'Jerry Smith', status: 'Alive', species: 'Human', gender: 'Male', image: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg' }
  ];

  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO characters (name, status, species, gender, image) VALUES (?, ?, ?, ?, ?)');
    localList.forEach(c => {
      stmt.run(c.name, c.status, c.species, c.gender, c.image);
    });
    stmt.finalize(err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  db,
  initDatabase,
  seedFromRickAndMorty
};
