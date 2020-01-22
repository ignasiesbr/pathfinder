import React from 'react';
import './App.css';
import Pathfinder from './components/Pathfinder';
import Header from './components/Header';
import Info from './components/Info';

function App() {
  return (
    <div className="app">
      <Header />
      <Info />
      <Pathfinder />
    </div>
  );
}

export default App;
