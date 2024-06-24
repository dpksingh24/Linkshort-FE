import React from 'react';
import UrlForm from './components/UrlForm';
import RedirectHandler from './components/RedirectHandler';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>URL Shortener</h1>
      <Routes>
        <Route path="/" element={<UrlForm />} />
        <Route path="/:slug" element={<RedirectHandler />} />
      </Routes>
    </div>
  </Router>
  );
};

export default App;
