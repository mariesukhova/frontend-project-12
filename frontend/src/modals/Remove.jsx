import React, { useEffect, useRef } from 'react';
import {
  Modal, Button,
} from 'react-bootstrap';

function Rename({ onClose, onChildFormSubmit, channelInfo }) {
  const handleSubmit = () => {
    onChildFormSubmit(channelInfo);
    onClose();
  };

  const ref = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
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
        <Modal.Title>Удалить канал</Modal.Title>
        <Button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
      </Modal.Header>
      <Modal.Body>
        <p>Уверены?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Отменить</Button>
        <Button variant="danger" onClick={handleSubmit} onKeyDown={handleSubmit} ref={ref}>Удалить</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Rename;
