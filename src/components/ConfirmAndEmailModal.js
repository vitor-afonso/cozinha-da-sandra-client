import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import { componentProps, modalStyle } from '../utils/app.styleClasses';

const NO_EMAIL = 'no-email';

const ConfirmAndEmailModal = ({ isLoading, mainFunction, setIsModalOpen, isModalOpen, question, buttonText, buttonText2 }) => {
  const [resMessage, setSesMessage] = useState(null);
  const runMainFunction = async (sendEmailChoice) => {
    const { message } = sendEmailChoice === NO_EMAIL ? await mainFunction(sendEmailChoice) : await mainFunction();
    setSesMessage(message);
  };
  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box sx={modalStyle}>
        {!resMessage && (
          <>
            <Typography variant={componentProps.variant.body1} sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
              {question}
            </Typography>

            <Box sx={{ mt: 2 }}>
              {!isLoading && (
                <>
                  {!buttonText2 && (
                    <Button variant={componentProps.variant.outlined} sx={{ mr: 1 }} onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </Button>
                  )}
                  {buttonText2 && (
                    <Button type={componentProps.type.button} variant={componentProps.variant.contained} sx={{ mr: 1 }} onClick={() => runMainFunction(NO_EMAIL)}>
                      {buttonText2}
                    </Button>
                  )}
                  <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={runMainFunction}>
                    {buttonText}
                  </Button>
                </>
              )}
            </Box>
          </>
        )}
        {resMessage && (
          <Typography variant={componentProps.variant.body1} sx={{ textAlign: 'center', mb: 1 }}>
            {resMessage}
          </Typography>
        )}
        {isLoading && <CircularProgress size='50px' />}
      </Box>
    </Modal>
  );
};

export default ConfirmAndEmailModal;