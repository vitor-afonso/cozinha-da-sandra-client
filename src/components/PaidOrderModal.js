import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import React from 'react';
import { modalStyle } from '../utils/app.styleClasses';

const PaidOrderModal = ({ isOrderPending, isPaidLoading, handleConfirmPayment, handleClosePaid, openPaid }) => {
  return (
    <Modal open={openPaid} onClose={handleClosePaid} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={modalStyle}>
        {isOrderPending ? (
          <>
            <Typography id='modal-modal-title' variant='body1' sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
              Confirme status do pedido antes.
            </Typography>
            <Button variant='outlined' onClick={handleClosePaid}>
              Voltar
            </Button>
          </>
        ) : (
          <>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Confirmar pago?
            </Typography>
            <Box sx={{ mt: 2 }}>
              {!isPaidLoading && (
                <>
                  <Button sx={{ mr: 1 }} variant='outlined' onClick={handleClosePaid}>
                    Cancelar
                  </Button>
                  <Button type='button' variant='contained' onClick={handleConfirmPayment}>
                    Confirmar
                  </Button>
                </>
              )}
              {isPaidLoading && <CircularProgress size='20px' />}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default PaidOrderModal;
