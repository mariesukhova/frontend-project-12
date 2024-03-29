import React, { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Modal, Button,
} from 'react-bootstrap';

const Rename = ({ onClose, onChildFormSubmit, channelInfo }) => {
  const { t } = useTranslation();
  const ref = useRef();

  const handleSubmit = useCallback(() => {
    onChildFormSubmit(channelInfo);
    onClose();
    toast.success(t('Channel removed!'), {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  }, [channelInfo, onChildFormSubmit, onClose, t]);

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
  }, [handleSubmit, onClose]);

  return (
    <Modal show>
      <Modal.Header>
        <Modal.Title>{t('Remove channel')}</Modal.Title>
        <Button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
      </Modal.Header>
      <Modal.Body>
        {t('Are you sure?')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>{t('Cancel')}</Button>
        <Button variant="danger" onClick={handleSubmit} onKeyDown={handleSubmit} ref={ref}>{t('Remove')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Rename;
