import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function GeneralInventory() {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0 });

  useEffect(() => {
    const storedInventory = JSON.parse(localStorage.getItem('inventory')) || [];
    setInventory(storedInventory);
  }, []);

  const addItem = () => {
    if (newItem.name && newItem.quantity > 0) {
      const updatedInventory = [...inventory, newItem];
      setInventory(updatedInventory);
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      setNewItem({ name: '', quantity: 0 });
    }
  };

  const updateQuantity = (index, amount) => {
    const updatedInventory = inventory.map((item, i) => 
      i === index ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
    );
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="general-inventory">
      <h2>Inventario General</h2>
      <div className="add-item">
        <input
          type="text"
          placeholder="Nombre del material"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
        />
        <button onClick={addItem}>Agregar</button>
      </div>
      <ul className="inventory-list">
        {inventory.map((item, index) => (
          <li key={index}>
            <div 
              className="material-icon" 
              style={{background: `linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()})`}}
            >
              {getInitials(item.name)}
            </div>
            <span className="material-name">{item.name}</span>
            <span className="material-quantity"> - Cantidad: {item.quantity}</span>
            <button onClick={() => updateQuantity(index, 1)}>+</button>
            <button onClick={() => updateQuantity(index, -1)}>-</button>
          </li>
        ))}
      </ul>
      <Link to="/" className="back-link">Volver a la página principal</Link>
    </div>
  );
}

export default GeneralInventory;