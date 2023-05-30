import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  Container, Row, Col, Card, Form, Button, FloatingLabel,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/index';
import routes from '../../routes';
import loginImg from './loginImg.jpeg';

const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const { t } = useTranslation();

  const auth = useAuth();
  const navigate = useNavigate();

  const handleOnSubmit = async (values) => {
    try {
      const response = await axios.post(routes.loginPath(), values);
      const obj = {};
      obj.token = response.data.token;
      obj.username = response.data.username;
      localStorage.setItem('userId', JSON.stringify(obj));
      auth.logIn();
      navigate('/');
    } catch (e) {
      setAuthFailed(true);
      toast.error(t('Connection error'), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
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
                <img src={loginImg} className="rounded-circle" alt={t('Enter')} />
              </Col>
              <Form className="col-12 col-md-6 mt-3 mt-md-0" onSubmit={f.handleSubmit}>
                <h1 className="text-center mb-4">{t('Enter')}</h1>
                <FloatingLabel controlId="username" label={t('Your nickname')} className="mb-4">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    type="text"
                    id="username"
                    placeholder={t('Your nickname')}
                    ref={inputRef}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    value={f.values.username}
                    isInvalid={authFailed}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="password" label={t('Password')} className="mb-4">
                  <Form.Control
                    name="password"
                    autoComplete="current-pasword"
                    type="password"
                    id="password"
                    placeholder={t('Password')}
                    onChange={f.handleChange}
                    value={f.values.password}
                    isInvalid={authFailed}
                  />
                  <Form.Control.Feedback type="invalid">{t('Not correct name or password')}</Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                  {t('Enter')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('Don\'t have an account?')}</span>
                {' '}
                <Link to="/signup">{t('Registration')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
