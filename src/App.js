import React from 'react';
import UrlForm from './components/UrlForm';

const App = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>URL Shortener</h1>
        <UrlForm />
    </div>
  );
};

export default App;
