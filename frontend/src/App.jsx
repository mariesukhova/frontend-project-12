import React, { useState, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import './App.css';

import NotFoundPage from './pages/notFound/NotFoundPage';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import AuthContext from './contexts/index';
import useAuth from './hooks/index';

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('userId') ?? false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const memo = useMemo(() => ({ loggedIn, logIn, logOut }));

  return (
    <AuthContext.Provider value={memo}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="h-100 bg-light">
          <div className="h-100">
            <div className="h-100" id="chat">
              <div className="d-flex flex-column h-100">
                <Navbar expand="lg" bg="white" className="shadow-sm">
                  <Container>
                    <Link to="/" className="custom-link">
                      <Navbar.Brand>
                        Hexlet Chat
                      </Navbar.Brand>
                    </Link>
                  </Container>
                </Navbar>
                <Routes>
                  <Route
                    path="/"
                    element={(
                      <PrivateRoute>
                        <HomePage />
                      </PrivateRoute>
                    )}
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
