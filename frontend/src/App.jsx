/* eslint-disable import/extensions */
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  // Link,
  // Navigate,
  // useLocation,
} from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import './App.css';
import NotFoundPage from './pages/notFound/NotFoundPage.jsx';
import LoginPage from './pages/login/loginPage';

function App() {
  return (
    <BrowserRouter>
      <div className="h-100 bg-light">
        <div className="h-100">
          <div className="h-100" id="chat">
            <div className="d-flex flex-column h-100">
              <Navbar expand="lg" bg="white" className="shadow-sm">
                <Container>
                  <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
                </Container>
              </Navbar>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
