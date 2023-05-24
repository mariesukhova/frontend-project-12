import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  Container, Row, Col, Card, Form, Button, FloatingLabel,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/index';
import routes from '../../routes';
import loginImg from './loginImg.jpeg';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [authFailed, setAuthFailed] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleOnSubmit = async (values) => {
    setError('');
    try {
      const response = await axios.post(routes.loginPath(), values);
      const obj = {};
      obj.token = response.data.token;
      obj.username = response.data.username;
      localStorage.setItem('userId', JSON.stringify(obj));
      auth.logIn();
      navigate('/');
      console.log(localStorage);
    } catch (e) {
      setAuthFailed(true);
      setError(e);
      console.log(error);
    }
  };

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      handleOnSubmit(values);
    },
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Container fluid className="vh-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card shadow-sm="true">
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <img src={loginImg} className="rounded-circle" alt="Войти" />
              </Col>
              <Form className="col-12 col-md-6 mt-3 mt-md-0" onSubmit={f.handleSubmit}>
                <h1 className="text-center mb-4">Войти</h1>
                <FloatingLabel htmlFor="username" label="Ваш ник" className="mb-4">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    type="text"
                    id="username"
                    placeholder="Ваш ник"
                    ref={inputRef}
                    onChange={f.handleChange}
                    value={f.values.username}
                    isInvalid={authFailed}
                    required
                  />
                </FloatingLabel>
                <FloatingLabel htmlFor="password" label="Пароль" className="mb-4">
                  <Form.Control
                    name="password"
                    autoComplete="current-pasword"
                    type="password"
                    id="password"
                    placeholder="Пароль"
                    onChange={f.handleChange}
                    value={f.values.password}
                    isInvalid={authFailed}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Неправильно указан логин и/или пароль</Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                  Войти
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                {' '}
                <a href="/signup">Регистрация</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
