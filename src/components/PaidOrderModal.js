import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import React from 'react';
import { componentProps, modalStyle } from '../utils/app.styleClasses';

const PaidOrderModal = ({ isOrderPending, isPaidLoading, handleConfirmPayment, setOpenPaid, openPaid }) => {
  return (
    <Modal open={openPaid} onClose={() => setOpenPaid(false)}>
      <Box sx={modalStyle}>
        {isOrderPending ? (
          <>
            <Typography variant={componentProps.variant.body1} sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
              Confirme status do pedido antes.
            </Typography>
            <Button variant={componentProps.variant.outlined} onClick={() => setOpenPaid(false)}>
              Voltar
            </Button>
          </>
        ) : (
          <>
            <Typography variant={componentProps.variant.h6} component={componentProps.variant.h2}>
              Confirmar pago?
            </Typography>
            <Box sx={{ mt: 2 }}>
              {!isPaidLoading && (
                <>
                  <Button sx={{ mr: 1 }} variant={componentProps.variant.outlined} onClick={() => setOpenPaid(false)}>
                    Cancelar
                  </Button>
                  <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={handleConfirmPayment}>
                    Confirmar
                  </Button>
                </>
              )}
              {isPaidLoading && <CircularProgress size='50px' />}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default PaidOrderModal;
