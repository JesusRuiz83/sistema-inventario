import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import GeneralInventory from './components/GeneralInventory';
import MaterialDelivery from './components/MaterialDelivery';
import EmployeeDetails from './components/EmployeeDetails';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/general-inventory" element={<GeneralInventory />} />
        <Route path="/material-delivery" element={<MaterialDelivery />} />
        <Route path="/employee-details/:name" element={<EmployeeDetails />} />
      </Routes>
    </div>
  );
}

export default App;