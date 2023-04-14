import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import React from 'react';
import { componentProps, modalStyle } from '../utils/app.styleClasses';

const ConfirmOrderModal = ({ isConfirmLoading, handleConfirmOrder, setIsModalOpen, isModalOpen }) => {
  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box sx={modalStyle}>
        <Typography variant={componentProps.variant.body1} sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
          Enviar email de confirmação?
        </Typography>
        <Box sx={{ mt: 2 }}>
          {!isConfirmLoading && (
            <>
              <Button sx={{ mr: 1 }} variant={componentProps.variant.outlined} onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={handleConfirmOrder}>
                Confirmar
              </Button>
            </>
          )}
          {isConfirmLoading && <CircularProgress size='50px' />}
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmOrderModal;
