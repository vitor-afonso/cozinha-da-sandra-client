// jshint esversion:9

import { Box, Button, TextField, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ShopOrder } from '../components/ShopOrder';
import { AuthContext } from '../context/auth.context';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { shopUsers } = useSelector((store) => store.users);
  const { shopOrders } = useSelector((store) => store.orders);
  const [profileOwner, setProfileOwner] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  const profileClasses = {
    container: {
      px: 3,
      pb: 3,
    },
    formContainer: {
      marginTop: 0,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mx: 'auto',
      minWidth: 300,
      maxWidth: 600,
    },
    formField: {
      marginTop: 0,
      marginBottom: 2,
      display: 'block',
    },
    nameField: {
      marginTop: 0,
      marginBottom: 2,
      display: 'block',
    },
    formTextArea: {
      minWidth: '100%',
      marginBottom: 5,
    },
    ordersNotVisible: {
      display: 'none',
    },
    ordersVisible: {
      //outline: '1px solid red',
    },
    breakpoints: {
      default: 4,
      1600: 3,
      1100: 2,
      700: 1,
    },
  };

  useEffect(() => {
    if (userId) {
      let allUserOrders = shopOrders.filter((order) => order.userId._id === userId);
      let owner = shopUsers.find((user) => user._id === userId);
      setUserOrders(allUserOrders);
      setProfileOwner(owner);
    }
  }, [userId, shopUsers, shopOrders]);

  const showOrders = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Box sx={profileClasses.container}>
      {profileOwner && shopOrders && (
        <>
          <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
            PERFIL
          </Typography>

          <Box sx={profileClasses.formContainer}>
            <Box sx={profileClasses.form}>
              <Box sx={{ maxWidth: '150px', mx: 'auto' }}>
                <img src={profileOwner.imageUrl} alt={profileOwner.username} style={{ maxWidth: '100%', height: 'auto', marginBottom: '25px' }} />
              </Box>

              <Box sx={{ width: '100%' }}>
                <TextField
                  id='outlined-read-only-input'
                  type='text'
                  label='Username'
                  defaultValue={profileOwner.username}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={profileClasses.formField}
                  fullWidth
                  size='small'
                />

                <TextField
                  id='outlined-read-only-input'
                  type='text'
                  label='Email'
                  defaultValue={profileOwner.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={profileClasses.formField}
                  fullWidth
                  size='small'
                />

                <TextField
                  id='outlined-read-only-input'
                  type='text'
                  label='Password'
                  defaultValue={'********'}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={profileClasses.formField}
                  fullWidth
                  size='small'
                />

                <TextField
                  id='outlined-read-only-input'
                  type='text'
                  label='Contacto'
                  defaultValue={profileOwner.contact}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={profileClasses.formField}
                  fullWidth
                  size='small'
                />

                {user.userType === 'admin' && (
                  <TextField
                    id='outlined-read-only-input'
                    type='text'
                    label='Notas'
                    defaultValue={profileOwner.info}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={profileClasses.formField}
                    fullWidth
                    size='small'
                    multiline
                    placeholder='Clique "Editar" para adicionar notas...'
                    rows={4}
                  />
                )}
              </Box>
              <Button sx={{ alignSelf: 'end' }} onClick={() => navigate(`/profile/edit/${userId}`)}>
                Editar
              </Button>
            </Box>
          </Box>

          <Button sx={{ mt: '16px', mb: '25px' }} variant='outlined' onClick={showOrders}>
            Histórico de pedidos
          </Button>

          <Box sx={!isVisible ? profileClasses.ordersNotVisible : profileClasses.ordersVisible}>
            <Masonry breakpointCols={profileClasses.breakpoints} className='my-masonry-grid' columnClassName='my-masonry-grid_column'>
              {userOrders.length > 0 &&
                userOrders.map((order) => {
                  return (
                    <div key={order._id}>
                      <ShopOrder order={order} />
                    </div>
                  );
                })}
            </Masonry>
            {userOrders.length === 0 && (
              <div>
                <Typography paragraph sx={{ mt: 4 }}>
                  Nenhum pedido encontrado.
                </Typography>
              </div>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProfilePage;
