const app = require('./app');
const { initDatabase } = require('./db');

const PORT = process.env.PORT || 5000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server aktif di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Inisialisasi database gagal:', err);
    process.exit(1);
  });
