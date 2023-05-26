import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Row, Col, Button, Nav, Form, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import _ from 'lodash';
import axios from 'axios';
import routes from '../../routes';
import { setMessages } from '../../slices/messagesSlice';
import { setChannels, setCurrentChannelId } from '../../slices/channelsSlice';
import AuthContext from '../../contexts/index';
import Add from '../../modals/Add';
import Rename from '../../modals/Rename';
import Remove from '../../modals/Remove';

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
  const {
    userData, socket,
  } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [isAddOpen, setShowAddModal] = useState(false);
  const [isRenameOpen, setShowRenameModal] = useState(false);
  const [isRemoveOpen, setShowRemoveModal] = useState(false);
  const [modalInfo, setModalInfo] = useState('');

  const getCurrentChannelName = (data, id) => {
    const name = data.filter((channel) => channel.id === id).map((channel) => channel.name);
    return `# ${name}`;
  };

  const getMessageCount = (data, id) => {
    const name = data.filter((message) => message.channelId === id);
    return `${name.length} сообщений`;
  };

  const makeChannelActive = (id) => {
    dispatch(setCurrentChannelId(id));
  };

  const handleRenameClick = (value) => {
    setShowRenameModal(true);
    setModalInfo(value);
  };

  const handleRemoveClick = (value) => {
    setShowRemoveModal(true);
    setModalInfo(value);
  };

  const getChannels = (data) => data.map((channel) => (
    <Nav.Item className="w-100" key={channel.id}>
      {channel.removable
        ? (
          <Dropdown as={ButtonGroup} className="w-100">
            <Button variant={channel.id === currentChannelId ? 'secondary' : null} className="w-100 rounded-0 text-start btn" onClick={() => makeChannelActive(channel.id)}>
              <span className="me-1">#</span>
              {channel.name}
            </Button>

            <Dropdown.Toggle split variant={channel.id === currentChannelId ? 'secondary' : null} id="dropdown-split-basic" />

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleRenameClick(channel)}>
                Переименовать
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleRemoveClick(channel)}>Удалить</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )
        : (
          <Button variant={channel.id === currentChannelId ? 'secondary' : null} className="w-100 rounded-0 text-start btn" onClick={() => makeChannelActive(channel.id)}>
            <span className="me-1">#</span>
            {channel.name}
          </Button>
        )}
    </Nav.Item>
  ));

  const getMessages = (data) => data.filter((message) => message.channelId === currentChannelId)
    .map((message) => (
      <div className="text-break mb-2" key={_.uniqueId()}>
        <b>{message.author}</b>
        :
        {' '}
        {message.message}
      </div>
    ));

  const f = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: (values, { resetForm }) => {
      socket.emit('newMessage', { message: values.message, channelId: currentChannelId, author: userData.username });
      resetForm();
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authHeader = getAuthHeader();
        const { data } = await axios.get(routes.usersPath(), { headers: authHeader });
        console.log(data);
        dispatch(setChannels(data.channels));
        dispatch(setMessages(data.messages));
        dispatch(setCurrentChannelId(1));
      } catch {
        setError('Ошибка при получении данных');
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleAddModalSubmit = (value) => {
    socket.emit('newChannel', value);
  };

  const handleRenameModalSubmit = (value) => {
    socket.emit('renameChannel', value);
  };

  const handleRemoveModalSubmit = (value) => {
    socket.emit('removeChannel', value);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowRenameModal(false);
    setShowRemoveModal(false);
  };

  return (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 overflow-hidden bg-white flex-md-row">
          <Col xs={4} md={2} className="border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>Каналы</b>
              <Button variant="submit" className="p-0 text-primary btn btn-group-vertical" onClick={() => setShowAddModal(true)}>
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
                  <b>{getCurrentChannelName(channels, currentChannelId)}</b>
                </p>
                <span className="text-muted">{getMessageCount(messages, currentChannelId)}</span>
              </div>
              <div id="messages-box" className="chat-messages overflow-auto px-5">
                {messages ? getMessages(messages) : null }
              </div>
              <div className="mt-auto px-5 py-3">
                <Form noValidate className="py-1 border rounded-2" onSubmit={f.handleSubmit}>
                  <div className="input-group has-validation">
                    <Form.Control
                      name="message"
                      aria-label="Новое сообщение"
                      placeholder="Введите сообщение..."
                      className="border-0 p-0 ps-2 form-control"
                      ref={inputRef}
                      onChange={f.handleChange}
                      value={f.values.message}
                      autoComplete="message"
                      required
                    />
                    <Button variant="link" type="submit" disabled={!f.values.message.length} className="btn btn-group-vertical">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                      </svg>
                      <span className="visually-hidden">Отправить</span>
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {isAddOpen ? <Add onChildFormSubmit={handleAddModalSubmit} onClose={() => handleCloseModal('add')} /> : null}
      {isRenameOpen ? <Rename onChildFormSubmit={handleRenameModalSubmit} onClose={() => handleCloseModal('rename')} channelInfo={modalInfo} /> : null}
      {isRemoveOpen ? <Remove onChildFormSubmit={handleRemoveModalSubmit} onClose={() => handleCloseModal('remove')} channelInfo={modalInfo} /> : null}
    </>
  );
}

export default HomePage;
