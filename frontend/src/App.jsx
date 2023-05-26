import React, { useState, useMemo } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import './App.css';
import { io } from 'socket.io-client';

import store from './slices/store';
import NotFoundPage from './pages/notFound/NotFoundPage';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/NewLoginPage';
import AuthContext from './contexts/index';
import useAuth from './hooks/index';
import { addMessage } from './slices/messagesSlice';
import { addChannel, renameChannel, removeChannel } from './slices/channelsSlice';

const socket = io();
socket
  .on('connect_error', () => {
    console.log('socket "connect_error"');
  })
  .on('connection', () => {
    console.log('new connection!');
  })
  .on('disconnect', (reason) => {
    console.log(`socket "disconnect" (${reason})`);
  })
  .on('newMessage', (data) => {
    store.dispatch(addMessage(data));
  })
  .on('newChannel', (data) => {
    store.dispatch(addChannel(data));
  })
  .on('renameChannel', (data) => {
    store.dispatch(renameChannel(data));
  })
  .on('removeChannel', (data) => {
    store.dispatch(removeChannel(data));
  });

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('userId') ?? false);
  const userData = JSON.parse(localStorage.getItem('userId'));

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const memo = useMemo(() => ({
    loggedIn, logIn, logOut, userData, socket,
  }));

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

function AuthButton() {
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Button type="button" className="btn btn-primary" onClick={auth.logOut}>Выйти</Button>
      : null
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <div className="vh-100 bg-light">
            <div className="h-100">
              <div className="h-100" id="chat">
                <div className="d-flex flex-column h-100">
                  <Navbar expand="lg" bg="white" className="shadow-sm">
                    <Container>
                      <Navbar.Brand as={Link} to="/" className="custom-link">
                        Hexlet Chat
                      </Navbar.Brand>
                      <AuthButton />
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
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
