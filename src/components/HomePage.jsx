import React from 'react';
import { Link } from 'react-router-dom';
import { FaWarehouse, FaTruck } from 'react-icons/fa';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Sistema de Inventario</h1>
      <div className="icon-container">
        <Link to="/general-inventory" className="icon-link">
          <FaWarehouse size={100} />
          <span>Inventario General</span>
        </Link>
        <Link to="/material-delivery" className="icon-link">
          <FaTruck size={100} />
          <span>Entrega de Materiales</span>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;