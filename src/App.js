import React from 'react';
import UrlForm from './components/UrlForm';
import HomePage from './components/HomePage';
import RedirectHandler from './components/RedirectHandler';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
    <div>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/url-manager" element={<UrlForm />} />
        <Route path="/:slug" element={<RedirectHandler />} />
      </Routes>
    </div>
  </Router>
  );
};

export default App;
