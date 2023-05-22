import React from 'react';
import {
  Container, Row, Col,
} from 'react-bootstrap';

function HomePage() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col className="text-center">
          <h1 className="h4 text-muted">Главная страница</h1>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
