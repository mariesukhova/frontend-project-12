import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, Form, Button,
} from 'react-bootstrap';
import { object, string } from 'yup';

function Rename({ onClose, onChildFormSubmit, channelInfo }) {
  const { t } = useTranslation();
  const { channels } = useSelector((state) => state.channelsReducer);
  const channelNames = channels.map((channel) => channel.name);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = object({
    name: string()
      .min(3, t('From 3 to 20 characters'))
      .max(20, t('From 3 to 20 characters'))
      .required('Required field')
      .notOneOf(channelNames, t('Must be unique')),
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
      toast.success(t('Channel renamed!'), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
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
        <Modal.Title>{t('Rename channel')}</Modal.Title>
        <Button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit} ref={ref}>
          <FormGroup controlId="name">
            <Form.Control
              name="name"
              id="name"
              type="text"
              className="form-control mb-2"
              ref={inputRef}
              onChange={f.handleChange}
              value={f.values.name}
              isInvalid={f.errors.name}
            />
            <Form.Label visuallyHidden>{t('Channel name')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {t(f.errors.name) }
            </Form.Control.Feedback>
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>{t('Cancel')}</Button>
        <Button variant="primary" onClick={f.handleSubmit}>{t('Send')}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Rename;
