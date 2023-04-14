import { componentProps, modalStyle } from '../utils/app.styleClasses';
import { Box, Button, Modal, Typography } from '@mui/material';

export function CustomModal({ isModalOpen, setIsModalOpen, mainFunction, question, buttonText }) {
  const runMainFunction = () => {
    mainFunction();
    setIsModalOpen(false);
  };

  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box sx={modalStyle}>
        <Typography variant={componentProps.variant.h6} component={componentProps.variant.h2}>
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
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button type={componentProps.type.button} color={componentProps.color.error} variant={componentProps.variant.contained} onClick={runMainFunction}>
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
