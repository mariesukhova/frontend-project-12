import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
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

const SingupPage = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');

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
      if (e.response.data.statusCode === 409) {
        setError(t('This user already exists'));
        toast.error(t('This user already exists'), {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } else {
        setError(t('Connection error'));
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
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required(t('Required field'))
      .min(3, t('From 3 to 20 characters'))
      .max(20, t('From 3 to 20 characters')),
    password: Yup.string()
      .required(t('Required field'))
      .min(6, t('At least 6 characters')),
    passwordConfirmation: Yup.string()
      .required(t('Required field'))
      .oneOf([Yup.ref('password'), null], t('Passwords must match')),
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

  console.log(f);

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
                <h1 className="text-center mb-4">{t('Registration')}</h1>
                <FloatingLabel controlId="username" label={t('Username')} className="mb-4">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    type="text"
                    id="username"
                    placeholder="asd"
                    ref={inputRef}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    value={f.values.username}
                    isInvalid={f.touched.username && (f.errors.username || error)}
                  />
                  {f.touched.username && (
                    <Form.Control.Feedback type="invalid" toolkit>
                      {t(f.errors.username)}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
                <FloatingLabel controlId="password" label={t('Password')} className="mb-4">
                  <Form.Control
                    name="password"
                    autoComplete="password"
                    type="password"
                    id="password"
                    placeholder={t('Password')}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    value={f.values.password}
                    isInvalid={f.touched.password && (f.errors.password || error)}
                  />
                  {f.touched.password && (
                  <Form.Control.Feedback type="invalid" toolkit>
                    {t(f.errors.password)}
                  </Form.Control.Feedback>
                  )}
                </FloatingLabel>
                <FloatingLabel controlId="passwordConfirmation" label={t('Confirm password')} className="mb-4">
                  <Form.Control
                    name="passwordConfirmation"
                    autoComplete="passwordConfirmation"
                    type="password"
                    id="passwordConfirmation"
                    placeholder={t('Confirm password')}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    value={f.values.passwordConfirmation}
                    isInvalid={
                      f.touched.passwordConfirmation && (f.errors.passwordConfirmation || error)
                    }
                  />
                  {f.touched.passwordConfirmation && (
                  <Form.Control.Feedback type="invalid" toolkit>
                    {t(f.errors.passwordConfirmation)}
                  </Form.Control.Feedback>
                  )}
                </FloatingLabel>
                { error ? <p className="text-danger">{error}</p> : null}
                <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                  {t('Register')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SingupPage;
