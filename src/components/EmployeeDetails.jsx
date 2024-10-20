import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function EmployeeDetails() {
  const { name } = useParams();
  const [deliveries, setDeliveries] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [returnQuantities, setReturnQuantities] = useState({});
  const [defectiveQuantities, setDefectiveQuantities] = useState({});

  useEffect(() => {
    const storedDeliveries = JSON.parse(localStorage.getItem('deliveries')) || [];
    const employeeDeliveries = storedDeliveries.filter(d => d.employeeName === name);
    setDeliveries(employeeDeliveries);
    const storedInventory = JSON.parse(localStorage.getItem('inventory')) || [];
    setInventory(storedInventory);
  }, [name]);

  const handleReturn = (deliveryIndex, itemIndex, isDefective) => {
    const updatedDeliveries = [...deliveries];
    const delivery = updatedDeliveries[deliveryIndex];
    const item = delivery.items[itemIndex];
    const quantityKey = `${deliveryIndex}-${itemIndex}`;
    const quantity = isDefective ? 
      (defectiveQuantities[quantityKey] || 0) : 
      (returnQuantities[quantityKey] || 0);

    if (quantity > item.quantity) return;

    item.quantity -= quantity;
    if (item.quantity === 0) {
      delivery.items.splice(itemIndex, 1);
    }

    if (!isDefective) {
      const updatedInventory = inventory.map(invItem => {
        if (invItem.name === item.name) {
          return { ...invItem, quantity: invItem.quantity + quantity };
        }
        return invItem;
      });
      setInventory(updatedInventory);
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    }

    if (delivery.items.length === 0) {
      updatedDeliveries.splice(deliveryIndex, 1);
    }

    setDeliveries(updatedDeliveries);
    localStorage.setItem('deliveries', JSON.stringify(updatedDeliveries));

    // Reset the input fields
    if (isDefective) {
      setDefectiveQuantities(prev => ({ ...prev, [quantityKey]: 0 }));
    } else {
      setReturnQuantities(prev => ({ ...prev, [quantityKey]: 0 }));
    }
  };

  return (
    <div className="employee-details">
      <h2>Detalles de {name}</h2>
      {deliveries.map((delivery, deliveryIndex) => (
        <div key={deliveryIndex} className="delivery">
          <h3>Entrega del {new Date(delivery.date).toLocaleString()}</h3>
          <ul>
            {delivery.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <div className="item-details">
                  <span>{item.name} - Cantidad: {item.quantity}</span>
                  <div className="return-actions">
                    <input
                      type="number"
                      placeholder="Cantidad a devolver"
                      value={returnQuantities[`${deliveryIndex}-${itemIndex}`] || ''}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 0;
                        setReturnQuantities(prev => ({
                          ...prev,
                          [`${deliveryIndex}-${itemIndex}`]: quantity
                        }));
                      }}
                      max={item.quantity}
                    />
                    <button onClick={() => handleReturn(deliveryIndex, itemIndex, false)}>
                      Devolver
                    </button>
                  </div>
                  <div className="defective-actions">
                    <input
                      type="number"
                      placeholder="Cantidad defectuosa"
                      value={defectiveQuantities[`${deliveryIndex}-${itemIndex}`] || ''}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 0;
                        setDefectiveQuantities(prev => ({
                          ...prev,
                          [`${deliveryIndex}-${itemIndex}`]: quantity
                        }));
                      }}
                      max={item.quantity}
                    />
                    <button onClick={() => handleReturn(deliveryIndex, itemIndex, true)}>
                      Marcar como defectuoso
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link to="/material-delivery" className="back-link">Volver a Entrega de Materiales</Link>
    </div>
  );
}

export default EmployeeDetails;