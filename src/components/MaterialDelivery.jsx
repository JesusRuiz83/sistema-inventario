import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MaterialDelivery() {
  const [inventory, setInventory] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [deliveries, setDeliveries] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const storedInventory = JSON.parse(localStorage.getItem('inventory')) || [];
    setInventory(storedInventory);
    const storedDeliveries = JSON.parse(localStorage.getItem('deliveries')) || [];
    setDeliveries(storedDeliveries);
  }, []);

  const handleQuantityChange = (itemName, quantity) => {
    setSelectedItems({ ...selectedItems, [itemName]: quantity });
  };

  const handleDelivery = () => {
    if (employeeName && Object.keys(selectedItems).length > 0) {
      const newDelivery = {
        employeeName,
        items: Object.entries(selectedItems).map(([name, quantity]) => ({ name, quantity })),
        date: new Date().toISOString(),
      };
      const updatedDeliveries = [...deliveries, newDelivery];
      setDeliveries(updatedDeliveries);
      localStorage.setItem('deliveries', JSON.stringify(updatedDeliveries));

      // Update inventory
      const updatedInventory = inventory.map(item => {
        if (selectedItems[item.name]) {
          return { ...item, quantity: item.quantity - selectedItems[item.name] };
        }
        return item;
      });
      setInventory(updatedInventory);
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));

      // Reset form
      setEmployeeName('');
      setSelectedItems({});
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const nameMatch = delivery.employeeName.toLowerCase().includes(searchName.toLowerCase());
    const dateMatch = delivery.date.includes(searchDate);
    
    if (searchName && searchDate) {
      return nameMatch && dateMatch;
    } else if (searchName) {
      return nameMatch;
    } else if (searchDate) {
      return dateMatch;
    }
    return true;
  });

  const groupedDeliveries = filteredDeliveries.reduce((acc, delivery) => {
    if (searchName) {
      if (!acc[delivery.employeeName]) {
        acc[delivery.employeeName] = [];
      }
      acc[delivery.employeeName].push(delivery);
    } else if (searchDate) {
      const date = new Date(delivery.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(delivery);
    } else {
      const key = `${delivery.employeeName} - ${new Date(delivery.date).toLocaleDateString()}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(delivery);
    }
    return acc;
  }, {});

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="material-delivery">
      <h2>Entrega de Materiales</h2>
      <input
        type="text"
        placeholder="Nombre del empleado"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
      />
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
            <span className="material-quantity"> - Disponible: {item.quantity}</span>
            <input
              type="number"
              placeholder="Cantidad a entregar"
              value={selectedItems[item.name] || ''}
              onChange={(e) => handleQuantityChange(item.name, parseInt(e.target.value) || 0)}
              max={item.quantity}
            />
          </li>
        ))}
      </ul>
      <button onClick={handleDelivery}>Realizar entrega</button>

      <h3>Búsqueda de entregas</h3>
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>
      <div className="delivery-list">
        {Object.entries(groupedDeliveries).map(([key, deliveries]) => (
          <div key={key} className="delivery-group">
            <h4>{key}</h4>
            <ul>
              {deliveries.map((delivery, index) => (
                <li key={index}>
                  {searchName ? new Date(delivery.date).toLocaleString() : delivery.employeeName}
                  <Link to={`/employee-details/${delivery.employeeName}`} className="details-link">Detalles</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link to="/" className="back-link">Volver a la página principal</Link>
    </div>
  );
}

export default MaterialDelivery;