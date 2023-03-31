import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import React from 'react';
import { componentProps, modalStyle } from '../utils/app.styleClasses';

const ConfirmOrderModal = ({ isConfirmLoading, handleConfirmOrder, handleClose, open }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={modalStyle}>
        <Typography id='modal-modal-title' variant={componentProps.variant.body1} sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
          Enviar email de confirmação?
        </Typography>
        <Box sx={{ mt: 2 }}>
          {!isConfirmLoading && (
            <>
              <Button sx={{ mr: 1 }} variant={componentProps.variant.outlined} onClick={handleClose}>
                Cancelar
              </Button>
              <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={handleConfirmOrder}>
                Confirmar
              </Button>
            </>
          )}
          {isConfirmLoading && <CircularProgress size='20px' />}
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmOrderModal;
