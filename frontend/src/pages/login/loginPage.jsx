import React, { useRef, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, FloatingLabel,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import loginImg from './loginImg.jpeg';

function LoginPage() {
  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
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
                    required
                  />
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

export default LoginPage;
