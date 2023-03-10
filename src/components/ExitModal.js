import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #816E94',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export function ExitModal({ isModalOpen, handleCloseModal, dispatch, mainFunction, question, buttonText }) {
  const runModalMainFunction = () => {
    if (dispatch) {
      dispatch(mainFunction());
      handleCloseModal();
      return;
    }
    mainFunction();
    handleCloseModal();
  };

  return (
    <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={modalStyle}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
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
            variant='outlined'
            onClick={handleCloseModal}
          >
            Cancelar
          </Button>
          <Button type='button' color='error' variant='contained' onClick={runModalMainFunction}>
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
