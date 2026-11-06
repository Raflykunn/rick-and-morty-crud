import React, { useState, useEffect } from 'react';
import CharacterForm from './components/CharacterForm';
import CharacterTable from './components/CharacterTable';

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [editingCharacter, setEditingCharacter] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchCharacters();
  }, [searchTerm, statusFilter]);

  const showNotification = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);

      const res = await fetch(`/api/characters?${params.toString()}`);
      if (!res.ok) throw new Error('Gagal mengambil data dari server');

      const data = await res.json();
      setCharacters(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Tidak dapat menghubungi server API. Pastikan backend aktif.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async (newCharacterData) => {
    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCharacterData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menambahkan karakter');
      }

      showNotification('Karakter baru berhasil ditambahkan.');
      setShowAddForm(false);
      fetchCharacters();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdateCharacter = async (updatedData) => {
    try {
      const res = await fetch(`/api/characters/${editingCharacter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal memperbarui karakter');
      }

      showNotification(`Karakter ${updatedData.name} berhasil diperbarui.`);
      setEditingCharacter(null);
      fetchCharacters();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteCharacter = async (id, name) => {
    const konfirmasi = window.confirm(`Hapus karakter "${name}"?`);
    if (!konfirmasi) return;

    try {
      const res = await fetch(`/api/characters/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Gagal menghapus karakter');

      showNotification(`Karakter "${name}" telah dihapus.`);
      fetchCharacters();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>Katalog Karakter Rick and Morty</h1>
        <p className="subtitle">Daftar dan kelola karakter dari semesta Rick and Morty</p>
      </header>

      {message && (
        <div className={`alert ${message.isError ? 'alert-danger' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="control-bar card">
        <div className="search-filter-group">
          <input
            type="text"
            placeholder="Cari nama atau spesies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-search"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-filter"
          >
            <option value="All">Semua Status</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="unknown">unknown</option>
          </select>
        </div>

        <button
          onClick={() => {
            if (editingCharacter) setEditingCharacter(null);
            setShowAddForm((prev) => !prev);
          }}
          className="btn btn-primary"
        >
          {showAddForm ? 'Tutup Form' : '+ Tambah Karakter'}
        </button>
      </div>

      {showAddForm && !editingCharacter && (
        <CharacterForm
          onSave={handleCreateCharacter}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingCharacter && (
        <CharacterForm
          editingCharacter={editingCharacter}
          onSave={handleUpdateCharacter}
          onCancel={() => setEditingCharacter(null)}
        />
      )}

      <div className="summary-info">
        <span>Total: <strong>{characters.length}</strong> karakter</span>
      </div>

      {loading ? (
        <div className="card text-center">
          <p>Memuat data karakter...</p>
        </div>
      ) : (
        <CharacterTable
          characters={characters}
          onEdit={(char) => {
            setShowAddForm(false);
            setEditingCharacter(char);
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
          onDelete={handleDeleteCharacter}
        />
      )}

      <footer className="app-footer">
        <p>Data dari <a href="https://rickandmortyapi.com/" target="_blank" rel="noreferrer">Rick and Morty API</a></p>
      </footer>
    </div>
  );
}

export default App;
