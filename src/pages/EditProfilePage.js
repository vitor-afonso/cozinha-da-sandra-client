// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUser, resetPassword, updateUser, uploadImage } from 'api';
import { AuthContext } from 'context/auth.context';
import { deleteShopUser, updateShopUser } from 'redux/features/users/usersSlice';
import { componentProps, editProfileClasses } from 'utils/app.styleClasses';
import { handleFileUpload } from 'utils/app.utils';
import { CustomModal } from 'components/CustomModal';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Controller, useForm } from 'react-hook-form';
import ErrorMessage from 'components/ErrorMessage';
import SuccessMessage from 'components/SuccessMessage';

const EditProfilePage = () => {
  const { user, logOutUser } = useContext(AuthContext);
  const { shopUsers } = useSelector((store) => store.users);
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  const [profileOwner, setProfileOwner] = useState(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputFileUpload = useRef(null);
  const submitFormButton = useRef(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isProfileOwner = user._id === userId ? true : false;
  const shouldShowDeleteButton = profileOwner && !profileOwner.deleted && profileOwner.userType === 'user';

  const {
    control,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm();

  // Watches value changes in fields
  let newPassword = watch('password');
  let newPassword2 = watch('password2');

  useEffect(() => {
    if (userId) {
      let owner = shopUsers.find((user) => user._id === userId);
      let initialFormValues = { username: owner.username, email: owner.email, contact: owner.contact ? owner.contact : '', password: '', password2: '', info: owner.info ? owner.info : '' };

      setProfileOwner(owner);
      setTempImageUrl(owner.imageUrl);
      reset(initialFormValues);

      if (user.userType === 'admin' && !isProfileOwner) {
        setDisabledInput(true);
      }
    }
  }, [userId, shopUsers, user, isProfileOwner, reset]);

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

  const isFieldRequired = (value) => {
    return value !== '' ? true : false;
  };

  const updateError = (value) => {
    if (value === '' && newPassword === '') {
      clearErrors('password');
    }
    if (value === '' && newPassword2 === '') {
      clearErrors('password2');
    }
  };

  const handleEditProfileSubmit = async ({ username, email, password, contact, info }) => {
    setIsLoading(true);

    try {
      if (objImageToUpload) {
        const uploadData = new FormData();

        uploadData.append('imageUrl', objImageToUpload);

        let { fileUrl } = await uploadImage(uploadData);

        const requestBody = { username, email, contact, imageUrl: fileUrl, info };

        if (password === '') {
          let userResponse = await updateUser(requestBody, userId);
          dispatch(updateShopUser(userResponse.data.updatedUser));
        } else {
          let response = await Promise.all([updateUser(requestBody, userId), resetPassword({ password }, userId)]);
          dispatch(updateShopUser(response[1].data));
        }
      } else {
        const requestBody = { username, email, contact, info };

        if (password === '') {
          let userResponse = await updateUser(requestBody, userId);
          dispatch(updateShopUser(userResponse.data.updatedUser));
        } else {
          let response = await Promise.all([updateUser(requestBody, userId), resetPassword({ password }, userId)]);
          dispatch(updateShopUser(response[1].data));
        }
      }

      setSuccessMessage('Perfil actualizado com sucesso.');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={editProfileClasses.container}>
      <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ my: 4 }}>
        EDITAR
      </Typography>

      {!successMessage && profileOwner && (
        <Box sx={editProfileClasses.formContainer}>
          <Box sx={editProfileClasses.form}>
            <form onSubmit={handleSubmit(handleEditProfileSubmit)} noValidate>
              <Box sx={{ maxWidth: '150px', mx: 'auto' }}>{tempImageUrl && <img src={tempImageUrl} alt='Novo item' style={{ maxWidth: '100%', height: 'auto', marginBottom: '25px' }} />}</Box>

              <Controller
                name={componentProps.name.username}
                control={control}
                rules={{ required: 'Username em falta' }}
                render={({ field }) => (
                  <TextField
                    label='Username'
                    type={componentProps.type.text}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={editProfileClasses.nameField}
                    error={errors.username ? true : false}
                    disabled={disabledInput}
                    autoComplete='true'
                    autoFocus
                    {...field}
                  />
                )}
              />

              <Controller
                name={componentProps.name.email}
                control={control}
                rules={{
                  required: 'Endereço de email em falta',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Endereço de email invalido',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label='Email'
                    type={componentProps.type.email}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    required
                    sx={editProfileClasses.nameField}
                    error={errors.email ? true : false}
                    disabled={disabledInput}
                    autoComplete='true'
                    {...field}
                  />
                )}
              />

              <Controller
                name={componentProps.name.contact}
                control={control}
                rules={{
                  pattern: { value: /^[0-9]{0,14}$/, message: 'Contacto inválido' },
                }}
                render={({ field }) => (
                  <TextField
                    label='Contacto'
                    type={componentProps.type.text}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={editProfileClasses.nameField}
                    error={errors.contact ? true : false}
                    disabled={disabledInput}
                    placeholder='912345678'
                    autoComplete='true'
                    {...field}
                  />
                )}
              />

              {isProfileOwner && !isLoading && (
                <>
                  <Controller
                    name={componentProps.name.password}
                    control={control}
                    rules={{
                      required: { value: isFieldRequired(newPassword2), message: 'Password em falta' },
                      pattern: {
                        value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
                        message: 'A password deve ter pelo menos 6 caracteres e conter pelo menos um número, uma letra minúscula e uma letra maiúscula.',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        label='Nova Password'
                        type={componentProps.type.password}
                        error={errors.password ? true : false}
                        {...field}
                        variant={componentProps.variant.outlined}
                        fullWidth
                        sx={editProfileClasses.nameField}
                        disabled={disabledInput}
                        placeholder='********'
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          updateError(value);
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={componentProps.name.password2}
                    control={control}
                    rules={{
                      required: { value: isFieldRequired(newPassword), message: 'Password em falta' },
                      validate: (value) => value === newPassword || 'Insira a mesma password nos 2 campos',
                    }}
                    render={({ field }) => (
                      <TextField
                        label='Repetir Password'
                        type={componentProps.type.password}
                        variant={componentProps.variant.outlined}
                        error={errors.password2 ? true : false}
                        fullWidth
                        sx={editProfileClasses.nameField}
                        disabled={disabledInput}
                        placeholder='********'
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          updateError(value);
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </>
              )}

              {user.userType === 'admin' && (
                <Controller
                  name={componentProps.name.info}
                  control={control}
                  render={({ field }) => <TextField label='Notas' multiline maxRows={4} sx={editProfileClasses.formTextArea} placeholder='Escreva aqui as suas notas...' {...field} />}
                />
              )}

              {errorMessage && <ErrorMessage message={errorMessage} />}
              {errors.username && <ErrorMessage message={errors.username.message} />}
              {errors.email && <ErrorMessage message={errors.email.message} />}
              {errors.contact && <ErrorMessage message={errors.contact.message} />}
              {errors.password && <ErrorMessage message={errors.password.message} />}
              {errors.password2 && <ErrorMessage message={errors.password2.message} />}

              <div>
                <button type={componentProps.type.submit} hidden ref={submitFormButton}>
                  Actualizar
                </button>
              </div>
            </form>
          </Box>
        </Box>
      )}

      {successMessage && <SuccessMessage message={successMessage} />}

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
              <Button
                sx={{ mr: 1, mt: { xs: 1, sm: 0 } }}
                type={componentProps.type.button}
                color={componentProps.color.error}
                variant={componentProps.variant.outlined}
                onClick={() => setIsModalOpen(true)}
              >
                Apagar
              </Button>
            )}

            <CustomModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} mainFunction={handleDeleteUser} question='Apagar utilizador?' buttonText='Apagar' />

            {profileOwner && profileOwner.deleted && (
              <Button
                sx={{ mr: 1, mt: { xs: 1, sm: 0 } }}
                variant={componentProps.variant.outlined}
                color={componentProps.color.success}
                type={componentProps.type.button}
                onClick={handleActivateUser}
              >
                Activar
              </Button>
            )}
            <>
              {isProfileOwner && (
                <Button
                  sx={{ mr: 1, mt: { xs: 1, sm: 0 } }}
                  type={componentProps.type.button}
                  variant={componentProps.variant.outlined}
                  endIcon={<AddIcon />}
                  onClick={() => inputFileUpload.current.click()}
                >
                  Imagem
                </Button>
              )}

              <Button type={componentProps.type.button} variant={componentProps.variant.contained} sx={{ mt: { xs: 1, sm: 0 } }} onClick={() => submitFormButton.current.click()}>
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
