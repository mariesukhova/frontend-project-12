/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  Container, Row, Col, Card, Form, Button, FloatingLabel,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/index';
import routes from '../../routes';
import signupImg from './signupImg.jpg';

export default function SingupPage() {
  const [error, setError] = useState('');
  const [authFailed, setAuthFailed] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleOnSubmit = async (values) => {
    setError('');
    try {
      const response = await axios.post(routes.signupPath(), values);
      const user = response.data;
      if (user) {
        localStorage.setItem('userId', JSON.stringify(user));
        auth.logIn();
        navigate('/');
      }
    } catch (e) {
      setAuthFailed(true);
      if (e.response.data.statusCode === 409) {
        setError('Такой пользователь уже существует');
      } else {
        setError('Ошибка сети');
      }
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'От 6 символов')
      .required('Обязательное поле'),
    passwordConfirmation: Yup.string()
      .required('Обязательное поле')
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
  });

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      const obj = {};
      obj.username = values.username;
      obj.password = values.password;
      handleOnSubmit(obj);
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
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={signupImg} className="rounded-circle" alt="Регистрация" />
              </div>
              <Form className="w-50" onSubmit={f.handleSubmit}>
                <h1 className="text-center mb-4">Регистрация</h1>
                <FloatingLabel htmlFor="username" label="Имя пользователя" className="mb-4">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    type="text"
                    id="username"
                    placeholder="Ваш ник"
                    ref={inputRef}
                    onChange={f.handleChange}
                    value={f.values.username}
                    isInvalid={f.errors.username || error}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    { f.errors.username }
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel htmlFor="password" label="Пароль" className="mb-4">
                  <Form.Control
                    name="password"
                    autoComplete="password"
                    type="password"
                    id="password"
                    placeholder="Пароль"
                    onChange={f.handleChange}
                    value={f.values.password}
                    isInvalid={f.errors.password || error}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    { f.errors.password }
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel htmlFor="passwordConfirmation" label="Подтвердите пароль" className="mb-4">
                  <Form.Control
                    name="passwordConfirmation"
                    autoComplete="passwordConfirmation"
                    type="password"
                    id="passwordConfirmation"
                    placeholder="Подтвердите пароль"
                    onChange={f.handleChange}
                    value={f.values.passwordConfirmation}
                    isInvalid={f.errors.passwordConfirmation || error}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    { f.errors.passwordConfirmation }
                  </Form.Control.Feedback>
                </FloatingLabel>
                { error ? <p className="text-danger">{error}</p> : null}
                <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                  Зарегистрироваться
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
