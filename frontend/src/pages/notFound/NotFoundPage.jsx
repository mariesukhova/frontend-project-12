import React from 'react';
import {
  Container, Row, Col, Image,
} from 'react-bootstrap';
import notFoundImg from './notFoundImg.svg';

function NotFoundPage() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col className="text-center">
          <Image alt="Страница не найдена" fluid className="h-25" src={notFoundImg} />
          <h1 className="h4 text-muted">Страница не найдена</h1>
          <p className="text-muted">
            Но вы можете перейти
            {' '}
            <a href="/">на главную страницу</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFoundPage;
