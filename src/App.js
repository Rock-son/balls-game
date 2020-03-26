import React from 'react';
import logo from './logo.svg';
import HomePage from "./pages/HomePage";

import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';



function App() {
  return (
    <div className="App">
      <header className="App-header">
         <HomePage />
      </header>
    </div>
  );
}

export default App;
