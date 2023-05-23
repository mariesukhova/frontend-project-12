import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Row, Col, Button, Nav,
} from 'react-bootstrap';
import axios from 'axios';
import routes from '../../routes';
import { setMessages } from '../../slices/messagesSlice';
import { setChannels, setCurrentChannelId } from '../../slices/channelsSlice';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

function HomePage() {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channelsReducer);
  const { messages } = useSelector((state) => state.messagesReducer);
  const [error, setError] = useState('');

  const makeChannelActive = (id) => {
    dispatch(setCurrentChannelId(id));
  };

  const getChannels = (data) => data.map((channel) => (
    <Nav.Item className="w-100" key={channel.id}>
      <Button variant={channel.id === currentChannelId ? 'secondary' : null} className="w-100 rounded-0 text-start btn" onClick={() => makeChannelActive(channel.id)}>
        <span className="me-1">#</span>
        {channel.name}
      </Button>
    </Nav.Item>
  ));

  const getMessages = (data) => {
    const chat = data.map((message) => (
      <div className="text-break mb-2">
        <b>admin</b>
        :
        {' '}
        {message}
      </div>
    ));
    return chat;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authHeader = getAuthHeader();
        const { data } = await axios.get(routes.usersPath(), { headers: authHeader });
        console.log(data);
        dispatch(setChannels(data.channels));
        dispatch(setMessages(data.messages));
      } catch (e) {
        console.log(e);
        console.log(error);
        setError('Ошибка при получении данных');
      }
    };

    fetchData();
  }, []);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 overflow-hidden bg-white flex-md-row">
        <Col xs={4} md={2} className="border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <Button variant="link" className="p-0 text-primary btn btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </Button>
          </div>
          <Nav id="channels-box" className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            { channels ? getChannels(channels) : null }
          </Nav>
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># general</b>
              </p>
              <span className="text-muted">1 сообщение</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {messages ? getMessages(messages) : null }
            </div>
            <div className="mt-auto px-5 py-3">
              <form noValidate className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <input
                    name="body"
                    aria-label="Новое сообщение"
                    placeholder="Введите сообщение..."
                    className="border-0 p-0 ps-2 form-control"
                    ref={inputRef}
                  />
                  <Button variant="link" type="submit" disabled className="btn btn-group-vertical">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                    <span className="visually-hidden">Отправить</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
