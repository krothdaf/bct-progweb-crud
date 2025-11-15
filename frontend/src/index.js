import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importa nosso CSS
import App from './App.js'; // Importa nosso componente principal

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);