import { componentProps, modalStyle } from '../utils/app.styleClasses';
import { Box, Button, Modal, Typography } from '@mui/material';

export function CustomModal({ isModalOpen, handleCloseModal, mainFunction, question, buttonText }) {
  const runModalMainFunction = () => {
    mainFunction();
    handleCloseModal();
  };

  return (
    <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={modalStyle}>
        <Typography id='modal-modal-title' variant={componentProps.variant.h6} component='h2'>
          {question}
        </Typography>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Button
            sx={{
              mr: 1,
            }}
            variant={componentProps.variant.outlined}
            onClick={handleCloseModal}
          >
            Cancelar
          </Button>
          <Button type={componentProps.type.button} color={componentProps.color.error} variant={componentProps.variant.contained} onClick={runModalMainFunction}>
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
