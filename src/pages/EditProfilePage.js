// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUser, resetPassword, updateUser, uploadImage } from '../api';
import { AuthContext } from '../context/auth.context';
import { deleteShopUser, updateShopUser } from '../redux/features/users/usersSlice';
import { editProfileClasses } from '../utils/app.styleClasses';
import { handleFileUpload } from '../utils/app.utils';
import { CustomModal } from '../components/CustomModal';

import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const EditProfilePage = () => {
  const { user, logOutUser } = useContext(AuthContext);
  const { shopUsers } = useSelector((store) => store.users);
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  const [profileOwner, setProfileOwner] = useState(null);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [contact, setContact] = useState('');
  const [info, setInfo] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputFileUpload = useRef(null);
  const submitFormButton = useRef();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isProfileOwner = user._id === userId ? true : false;
  const shouldShowDeleteButton = profileOwner && !profileOwner.deleted && profileOwner.userType === 'user';

  useEffect(() => {
    if (userId) {
      let owner = shopUsers.find((user) => user._id === userId);

      setProfileOwner(owner);
      setTempImageUrl(owner.imageUrl);
      setUsername(owner.username);
      setEmail(owner.email);
      if (owner.contact) {
        setContact(owner.contact);
      }
      if (owner.info) {
        setInfo(owner.info);
      }
      if (user.userType === 'admin' && !isProfileOwner) {
        setDisabledInput(true);
      }
    }
  }, [userId, shopUsers, user, isProfileOwner]);

  const validateContact = (e) => {
    //regEx to prevent from typing letters and adding limit of 14 digits
    const re = /^[0-9]{0,14}$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setContact(e.target.value);
    }
  };

  const handleActivateUser = async () => {
    try {
      let response = await updateUser({ deleted: false }, userId);

      dispatch(updateShopUser(response.data.updatedUser));
      setSuccessMessage('Utilizador activado com sucesso.');
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeleteUser = async () => {
    try {
      let response = await deleteUser(userId);

      dispatch(deleteShopUser(response.data));
      setSuccessMessage('Utilizador desactivado com sucesso.');

      if (isProfileOwner) {
        logOutUser();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setUsernameError(true);
      setErrorMessage('Por favor introduza username.');
      return;
    }
    setUsernameError(false);

    if (!email) {
      setEmailError(true);
      setErrorMessage('Por favor introduza email.');
      return;
    }
    setEmailError(false);

    if (newPassword && newPassword !== newPassword2) {
      setPasswordError(true);
      setErrorMessage('Por favor insira a mesma password nos 2 campos.');
      return;
    }
    setPasswordError(false);

    setIsLoading(true);

    try {
      const passwordBody = { password: newPassword };

      if (objImageToUpload) {
        const uploadData = new FormData();

        uploadData.append('imageUrl', objImageToUpload);

        let { fileUrl } = await uploadImage(uploadData);

        const requestBody = { username, email, contact, imageUrl: fileUrl, info };

        if (newPassword !== '') {
          let response = await Promise.all([updateUser(requestBody, userId), resetPassword(passwordBody, userId)]);
          dispatch(updateShopUser(response[1].data));
        } else {
          let userResponse = await updateUser(requestBody, userId);
          dispatch(updateShopUser(userResponse.data.updatedUser));
        }
        setIsLoading(false);
      } else {
        const requestBody = { username, email, contact, info };

        if (newPassword !== '') {
          let response = await Promise.all([updateUser(requestBody, userId), resetPassword(passwordBody, userId)]);
          dispatch(updateShopUser(response[1].data));
        } else {
          let userResponse = await updateUser(requestBody, userId);
          dispatch(updateShopUser(userResponse.data.updatedUser));
        }
        setIsLoading(false);
      }

      setSuccessMessage('Perfil actualizado com sucesso.');
    } catch (error) {
      console.log('error in editProfile', error);
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
      setIsLoading(false);
    }
  };

  return (
    <Box sx={editProfileClasses.container}>
      <Typography variant='h2' color='primary' sx={{ my: 4 }}>
        EDITAR
      </Typography>

      {!successMessage && profileOwner && (
        <Box sx={editProfileClasses.formContainer}>
          <Box sx={editProfileClasses.form}>
            <form onSubmit={handleSubmit} noValidate>
              <Box sx={{ maxWidth: '150px', mx: 'auto' }}>{tempImageUrl && <img src={tempImageUrl} alt='Novo item' style={{ maxWidth: '100%', height: 'auto', marginBottom: 4 }} />}</Box>

              <TextField
                label='Username'
                type='text'
                variant='outlined'
                fullWidth
                required
                sx={editProfileClasses.nameField}
                onChange={(e) => isProfileOwner && setUsername(e.target.value)}
                error={usernameError}
                value={username}
                disabled={disabledInput}
              />

              <TextField
                label='Email'
                type='email'
                variant='outlined'
                fullWidth
                required
                sx={editProfileClasses.nameField}
                onChange={(e) => isProfileOwner && setEmail(e.target.value)}
                error={emailError}
                value={email}
                disabled={disabledInput}
              />

              <TextField
                label='Contacto'
                type='text'
                variant='outlined'
                fullWidth
                sx={editProfileClasses.nameField}
                onChange={isProfileOwner && validateContact}
                value={contact}
                disabled={disabledInput}
                placeholder='912345678'
              />

              {isProfileOwner && !isLoading && (
                <>
                  <TextField
                    label='Nova Password'
                    type='password'
                    variant='outlined'
                    fullWidth
                    sx={editProfileClasses.nameField}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={passwordError}
                    value={newPassword}
                    disabled={disabledInput}
                    placeholder='********'
                  />

                  <TextField
                    label='Repetir Password'
                    type='password'
                    variant='outlined'
                    fullWidth
                    sx={editProfileClasses.nameField}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    error={passwordError}
                    value={newPassword2}
                    disabled={disabledInput}
                    placeholder='********'
                  />
                </>
              )}

              {user.userType === 'admin' && (
                <TextField
                  id='outlined-multiline-flexible'
                  label='Notas'
                  multiline
                  maxRows={4}
                  sx={editProfileClasses.formTextArea}
                  onChange={(e) => setInfo(e.target.value)}
                  value={info}
                  placeholder='Escreva aqui a descrição'
                />
              )}

              {errorMessage && (
                <Typography paragraph sx={{ mb: 4 }} color='error'>
                  {errorMessage}
                </Typography>
              )}

              <div>
                <button type='submit' hidden ref={submitFormButton}>
                  Actualizar
                </button>
              </div>
            </form>
          </Box>
        </Box>
      )}

      {successMessage && (
        <Typography paragraph sx={{ my: 4 }}>
          {successMessage}
        </Typography>
      )}

      <Box>
        {!isLoading && (
          <Button sx={{ mr: 1, mt: { xs: 1, sm: 0 } }} onClick={() => navigate(-1)}>
            Voltar
          </Button>
        )}

        {!successMessage && !isLoading && (
          <>
            <input ref={inputFileUpload} hidden type='file' onChange={(e) => handleFileUpload(e, setTempImageUrl, setObjImageToUpload)} />

            {shouldShowDeleteButton && (
              <Button sx={{ mr: 1, mt: { xs: 1, sm: 0 } }} type='button' color='error' variant='outlined' onClick={handleOpen}>
                Apagar
              </Button>
            )}

            <CustomModal isModalOpen={open} handleCloseModal={handleClose} mainFunction={handleDeleteUser} question='Apagar Utilizador?' buttonText='Apagar' />

            {profileOwner && profileOwner.deleted && (
              <Button sx={{ mr: 1, mt: { xs: 1, sm: 0 } }} variant='outlined' color='success' type='button' onClick={handleActivateUser}>
                Activar
              </Button>
            )}
            <>
              {isProfileOwner && (
                <Button sx={{ mr: 1, mt: { xs: 1, sm: 0 } }} type='button' variant='outlined' endIcon={<AddIcon />} onClick={() => inputFileUpload.current.click()}>
                  Imagem
                </Button>
              )}

              <Button type='button' variant='contained' sx={{ mt: { xs: 1, sm: 0 } }} onClick={() => submitFormButton.current.click()}>
                Actualizar
              </Button>
            </>
          </>
        )}
        {isLoading && !successMessage && <CircularProgress size='80px' sx={{ mb: 2 }} />}
      </Box>
    </Box>
  );
};

export default EditProfilePage;
