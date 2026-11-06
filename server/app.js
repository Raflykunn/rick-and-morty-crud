const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/characters', (req, res) => {
  const { search, status } = req.query;
  let sql = 'SELECT * FROM characters WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (name LIKE ? OR species LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status && status !== 'All') {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal mengambil data karakter' });
    }
    res.json(rows);
  });
});

app.get('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM characters WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Terjadi kesalahan pada database' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Karakter tidak ditemukan' });
    }
    res.json(row);
  });
});

app.post('/api/characters', (req, res) => {
  const { name, status, species, gender, image } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Nama karakter wajib diisi' });
  }

  const charStatus = status || 'Alive';
  const charSpecies = species || 'Human';
  const charGender = gender || 'unknown';
  const charImage = image || 'https://rickandmortyapi.com/api/character/avatar/19.jpeg';

  const sql = 'INSERT INTO characters (name, status, species, gender, image) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [name.trim(), charStatus, charSpecies, charGender, charImage], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Gagal menambahkan karakter' });
    }
    res.status(201).json({
      id: this.lastID,
      name: name.trim(),
      status: charStatus,
      species: charSpecies,
      gender: charGender,
      image: charImage
    });
  });
});

app.put('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  const { name, status, species, gender, image } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Nama karakter tidak boleh kosong' });
  }

  db.get('SELECT * FROM characters WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Karakter tidak ditemukan' });

    const updatedName = name.trim();
    const updatedStatus = status || row.status;
    const updatedSpecies = species || row.species;
    const updatedGender = gender || row.gender;
    const updatedImage = image || row.image;

    const sql = 'UPDATE characters SET name = ?, status = ?, species = ?, gender = ?, image = ? WHERE id = ?';
    db.run(sql, [updatedName, updatedStatus, updatedSpecies, updatedGender, updatedImage, id], function (updateErr) {
      if (updateErr) {
        return res.status(500).json({ error: 'Gagal memperbarui data karakter' });
      }
      res.json({
        id: Number(id),
        name: updatedName,
        status: updatedStatus,
        species: updatedSpecies,
        gender: updatedGender,
        image: updatedImage
      });
    });
  });
});

app.delete('/api/characters/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM characters WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Karakter tidak ditemukan' });

    db.run('DELETE FROM characters WHERE id = ?', [id], function (delErr) {
      if (delErr) {
        return res.status(500).json({ error: 'Gagal menghapus karakter' });
      }
      res.json({ message: 'Karakter berhasil dihapus', id: Number(id) });
    });
  });
});

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

module.exports = app;
