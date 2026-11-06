const { test, describe, before } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server/app');
const { initDatabase } = require('../server/db');

describe('REST API Characters CRUD Tests', () => {
  before(async () => {
    await initDatabase();
  });

  let createdId = null;

  test('GET /api/characters harus mengembalikan status 200 dan array karakter', async () => {
    const res = await request(app).get('/api/characters');
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body), 'Response harus berupa array');
    assert.ok(res.body.length > 0, 'Database minimal memiliki seed data');
  });

  test('POST /api/characters harus gagal (400) jika nama kosong', async () => {
    const res = await request(app).post('/api/characters').send({
      name: '',
      status: 'Alive'
    });
    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.body.error, 'Harus ada pesan error');
  });

  test('POST /api/characters harus berhasil (201) membuat karakter baru', async () => {
    const newChar = {
      name: 'Birdperson',
      status: 'Alive',
      species: 'Alien',
      gender: 'Male',
      image: 'https://rickandmortyapi.com/api/character/avatar/47.jpeg'
    };

    const res = await request(app).post('/api/characters').send(newChar);
    assert.strictEqual(res.statusCode, 201);
    assert.ok(res.body.id, 'Harus mengembalikan id yang baru dibuat');
    assert.strictEqual(res.body.name, 'Birdperson');
    createdId = res.body.id;
  });

  test('GET /api/characters/:id harus mengembalikan karakter yang telah dibuat', async () => {
    const res = await request(app).get(`/api/characters/${createdId}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.id, createdId);
    assert.strictEqual(res.body.name, 'Birdperson');
  });

  test('PUT /api/characters/:id harus berhasil (200) mengupdate karakter', async () => {
    const updated = {
      name: 'Phoenixperson',
      status: 'Dead',
      species: 'Cyborg',
      gender: 'Male'
    };

    const res = await request(app).put(`/api/characters/${createdId}`).send(updated);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.name, 'Phoenixperson');
    assert.strictEqual(res.body.status, 'Dead');
  });

  test('DELETE /api/characters/:id harus berhasil (200) menghapus karakter', async () => {
    const res = await request(app).delete(`/api/characters/${createdId}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.id, createdId);
  });

  test('GET /api/characters/:id setelah dihapus harus mengembalikan 404', async () => {
    const res = await request(app).get(`/api/characters/${createdId}`);
    assert.strictEqual(res.statusCode, 404);
  });
});
