import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, Form, Button,
} from 'react-bootstrap';
import { object, string } from 'yup';

function Rename({ onClose, onChildFormSubmit, channelInfo }) {
  const { channels } = useSelector((state) => state.channelsReducer);
  const channelNames = channels.map((channel) => channel.name);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = object({
    name: string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(channelNames, 'Должно быть уникальным'),
  });

  const f = useFormik({
    initialValues: {
      name: channelInfo.name,
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      onChildFormSubmit({
        id: channelInfo.id,
        name: values.name,
        removable: true,
      });
      onClose();
    },
  });

  const ref = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Modal show>
      <Modal.Header>
        <Modal.Title>Переименовать канал</Modal.Title>
        <Button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit} ref={ref}>
          <FormGroup>
            <Form.Control
              name="name"
              aria-label="Новое сообщение"
              className="form-control mb-4"
              ref={inputRef}
              onChange={f.handleChange}
              value={f.values.name}
              isInvalid={f.errors.name}
              required
            />
            <Form.Control.Feedback type="invalid">
              { f.errors.name }
            </Form.Control.Feedback>
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Отменить</Button>
        <Button variant="primary" onClick={f.handleSubmit}>Отправить</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Rename;
