import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container, Row, Col, Image,
} from 'react-bootstrap';
import notFoundImg from './notFoundImg.svg';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Row className="justify-content-center">
        <Col className="text-center">
          <Image alt="Страница не найдена" fluid className="h-25" src={notFoundImg} />
          <h1 className="h4 text-muted">{t('Page not found')}</h1>
          <p className="text-muted">
            {t('But you can go ')}
            {' '}
            <a href="/">{t('to the main page')}</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
