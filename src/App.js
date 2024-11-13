import React, { useState } from 'react';
import Dashboard from './Dashboard';
import LoginPage from './login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (email) => {
    // In a real application, you would typically store the user session
    // in a more secure way, possibly using JWT tokens or session cookies
    setUser({ email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app">
      {user ? (
        <>
          <nav className="navbar navbar-light bg-light">
            <span className="navbar-brand mb-0 h1">Dashboard</span>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </nav>
          <Dashboard />
        </>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;