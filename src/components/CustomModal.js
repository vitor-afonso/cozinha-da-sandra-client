import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
import { modalStyle } from '../utils/app.styleClasses';

export function CustomModal({ isModalOpen, handleCloseModal, mainFunction, question, buttonText }) {
  const runModalMainFunction = () => {
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
