import React from 'react';

function CharacterTable({ characters, onEdit, onDelete }) {
  if (!characters || characters.length === 0) {
    return (
      <div className="card text-center">
        <p>Tidak ada data karakter yang ditemukan.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'alive') return <span className="badge badge-alive">Alive</span>;
    if (s === 'dead') return <span className="badge badge-dead">Dead</span>;
    return <span className="badge badge-unknown">unknown</span>;
  };

  return (
    <div className="table-responsive card">
      <table className="custom-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>ID</th>
            <th style={{ width: '70px' }}>Foto</th>
            <th>Nama Karakter</th>
            <th>Status</th>
            <th>Spesies</th>
            <th>Gender</th>
            <th style={{ width: '150px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <img
                  src={item.image || 'https://rickandmortyapi.com/api/character/avatar/19.jpeg'}
                  alt={item.name}
                  className="avatar-img"
                  onError={(e) => {
                    e.target.src = 'https://rickandmortyapi.com/api/character/avatar/19.jpeg';
                  }}
                />
              </td>
              <td>
                <strong>{item.name}</strong>
              </td>
              <td>{getStatusBadge(item.status)}</td>
              <td>{item.species || '-'}</td>
              <td>{item.gender || '-'}</td>
              <td>
                <div className="table-actions">
                  <button
                    onClick={() => onEdit(item)}
                    className="btn btn-sm btn-edit"
                    title="Edit Karakter"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id, item.name)}
                    className="btn btn-sm btn-delete"
                    title="Hapus Karakter"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CharacterTable;
