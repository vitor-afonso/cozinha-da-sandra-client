// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUser, resetPassword, updateUser, uploadImage } from '../api';
import { AuthContext } from '../context/auth.context';
import { deleteShopUser, updateShopUser } from '../redux/features/users/usersSlice';

export const EditProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { shopUsers } = useSelector((store) => store.users);
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  const [profileOwner, setProfileOwner] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [contact, setContact] = useState('');
  const [info, setInfo] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const inputFileUpload = useRef(null);
  const submitFormButton = useRef();
  const { userId } = useParams();
  const navigate = useNavigate();

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
      if (user.userType === 'admin' && userId !== user._id) {
        setDisabledInput(true);
      }
    }
  }, [userId, shopUsers, user]);

  const handleFileUpload = async (e) => {
    try {
      if (e.target.files.lenght !== 0) {
        setTempImageUrl(URL.createObjectURL(e.target.files[0]));
        setObjImageToUpload(e.target.files[0]);
      }
    } catch (error) {
      console.log('Error while uploading the file: ', error);
    }
  };

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
      setTimeout(() => navigate('/users'), 5000);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeleteUser = async () => {
    // showDeleteModal() - on click apagar
    // delete user - on confirm delete
    try {
      let response = await deleteUser(userId);

      dispatch(deleteShopUser(response.data));
      setSuccessMessage('Utilizador "apagado" com sucesso.');
      setTimeout(() => navigate('/users'), 5000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== newPassword2) {
      setErrorMessage('Por favor insira a mesma password nos 2 campos.');
      return;
    }

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
      } else {
        const requestBody = { username, email, contact, info };

        if (newPassword !== '') {
          let response = await Promise.all([updateUser(requestBody, userId), resetPassword(passwordBody, userId)]);
          dispatch(updateShopUser(response[1].data));
        } else {
          let userResponse = await updateUser(requestBody, userId);
          dispatch(updateShopUser(userResponse.data.updatedUser));
        }
      }

      setSuccessMessage('Perfil actualizado com sucesso.');
      setTimeout(() => navigate(`/profile/${userId}`), 5000);
    } catch (error) {
      console.log('error in editProfile', error);
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div>
      <h2>Editar perfil</h2>
      {!successMessage && profileOwner && (
        <>
          <form onSubmit={handleSubmit}>
            <figure>{tempImageUrl && <img src={tempImageUrl} alt={user.username} style={{ width: '150px', height: 'auto' }} />}</figure>

            <div>
              <label htmlFor='Username'>Username</label>
              <div>
                <input name='Username' type='text' required disabled={disabledInput} value={username} onChange={(e) => setUsername(e.target.value)} placeholder={username} />
              </div>
            </div>

            <div>
              <label htmlFor='email'>Email address</label>
              <div>
                <input id='email' name='email' type='email' disabled={disabledInput} autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label htmlFor='contact'>Contacto</label>
              <div>
                <input name='contact' type='text' disabled={disabledInput} value={contact} onChange={(e) => validateContact(e)} placeholder='912345678' />
              </div>
            </div>

            <div>
              <label htmlFor='password'>Nova Password</label>
              <div>
                <input
                  id='new-password'
                  disabled={disabledInput}
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor='password'>Repita Nova Password</label>
              <div>
                <input
                  id='new-password-2'
                  name='password-2'
                  disabled={disabledInput}
                  type='password'
                  autoComplete='current-password'
                  value={newPassword2}
                  onChange={(e) => setNewPassword2(e.target.value)}
                />
              </div>
            </div>

            {user.userType === 'admin' && (
              <div>
                <label htmlFor='user-info'>Info</label>
                <div>
                  <textarea id='add-item-description' name='user-info' value={info} placeholder='Informação de cliente.' onChange={(e) => setInfo(e.target.value)}></textarea>
                </div>
              </div>
            )}

            {errorMessage && <p>{errorMessage}</p>}

            <div>
              <button type='submit' hidden ref={submitFormButton}>
                Actualizar
              </button>
            </div>
          </form>
        </>
      )}

      {successMessage && <p>{successMessage}</p>}

      <div>
        <span onClick={() => navigate(-1)}>Voltar</span>

        {!successMessage && (
          <>
            <input ref={inputFileUpload} hidden type='file' onChange={(e) => handleFileUpload(e)} />
            {profileOwner && !profileOwner.deleted && (
              <button type='button' onClick={handleDeleteUser}>
                Apagar
              </button>
            )}
            {profileOwner && profileOwner.deleted && (
              <button type='button' onClick={handleActivateUser}>
                Activar
              </button>
            )}
            {user.userType === 'user' && (
              <button type='button' onClick={() => inputFileUpload.current.click()}>
                Escolher Imagem
              </button>
            )}
            <button type='button' onClick={() => submitFormButton.current.click()}>
              Actualizar
            </button>
          </>
        )}
      </div>
    </div>
  );
};
