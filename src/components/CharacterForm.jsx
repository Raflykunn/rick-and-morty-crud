import React, { useState, useEffect } from 'react';

function CharacterForm({ onSave, editingCharacter, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: ''
  });

  useEffect(() => {
    if (editingCharacter) {
      setFormData({
        name: editingCharacter.name || '',
        status: editingCharacter.status || 'Alive',
        species: editingCharacter.species || 'Human',
        gender: editingCharacter.gender || 'Male',
        image: editingCharacter.image || ''
      });
    } else {
      setFormData({
        name: '',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        image: ''
      });
    }
  }, [editingCharacter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama karakter tidak boleh kosong');
      return;
    }

    const finalData = {
      ...formData,
      image: formData.image.trim() || 'https://rickandmortyapi.com/api/character/avatar/19.jpeg'
    };

    onSave(finalData);
  };

  return (
    <div className="card">
      <h3>{editingCharacter ? 'Edit Karakter' : 'Tambah Karakter Baru'}</h3>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Nama Karakter *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Rick Sanchez"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="unknown">unknown</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="species">Spesies</label>
          <input
            id="species"
            type="text"
            name="species"
            value={formData.species}
            onChange={handleChange}
            placeholder="Contoh: Human, Alien, Robot"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Genderless">Genderless</option>
            <option value="unknown">unknown</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="image">URL Foto / Avatar</label>
          <input
            id="image"
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://rickandmortyapi.com/api/character/avatar/..."
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" className="btn btn-primary">
            {editingCharacter ? 'Simpan' : 'Tambahkan'}
          </button>
          {editingCharacter && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CharacterForm;
