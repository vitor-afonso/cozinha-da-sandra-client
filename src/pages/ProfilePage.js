// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ShopOrder } from 'components/ShopOrder';
import { AuthContext } from 'context/auth.context';
import { componentProps, profileClasses } from 'utils/app.styleClasses';
import SettingsModal from 'components/SettingsModal';
import { Box, Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { shopUsers } = useSelector((store) => store.users);
  const { shopOrders, isLoadingOrders } = useSelector((store) => store.orders);
  const [profileOwner, setProfileOwner] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const ordersRef = useRef(null);
  const isAdmin = user.userType === 'admin';

  useEffect(() => {
    if (userId) {
      let allUserOrders = shopOrders.filter((order) => order.userId._id === userId && !order.deleted);
      setUserOrders(allUserOrders);
    }
  }, [user, userId, shopOrders]);

  useEffect(() => {
    if (userId) {
      let owner = shopUsers.find((user) => user._id === userId);
      setProfileOwner(owner);
    }
  }, [userId, shopUsers, shopOrders]);

  const showOrders = () => {
    setIsVisible(!isVisible);
    setTimeout(() => scrollToOrders(ordersRef), 300);
  };

  const scrollToOrders = (elemRef) => {
    window.scrollTo({
      top: elemRef.current.offsetTop - 80,
      behavior: 'smooth',
    });
  };

  return (
    <Box sx={profileClasses.container}>
      {profileOwner && shopOrders && (
        <Box>
          <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ my: 4 }}>
            PERFIL
          </Typography>

          <Box sx={profileClasses.formContainer}>
            <Box sx={profileClasses.form}>
              <Box sx={{ maxWidth: '150px', mx: 'auto' }}>
                <img src={profileOwner.imageUrl} alt={profileOwner.username} style={{ maxWidth: '100%', height: 'auto', marginBottom: '25px' }} />
              </Box>

              <Box sx={{ width: '100%' }}>
                <TextField
                  type={componentProps.type.text}
                  label='Username'
                  value={profileOwner.username}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={profileClasses.formField}
                  fullWidth
                  size={componentProps.size.small}
                />

                <TextField
                  type={componentProps.type.text}
                  label='Email'
                  value={profileOwner.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={profileClasses.formField}
                  fullWidth
                  size={componentProps.size.small}
                />

                <TextField
                  type={componentProps.type.text}
                  label='Password'
                  value={'********'}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={profileClasses.formField}
                  fullWidth
                  size={componentProps.size.small}
                />

                <TextField
                  type={componentProps.type.text}
                  label='Contacto'
                  value={profileOwner.contact ? profileOwner.contact : 'Sem número'}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={profileClasses.formField}
                  fullWidth
                  size={componentProps.size.small}
                />

                {isAdmin && (
                  <TextField
                    type={componentProps.type.text}
                    label='Notas'
                    value={profileOwner.info}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={profileClasses.formField}
                    fullWidth
                    size={componentProps.size.small}
                    multiline
                    placeholder='Clique "Editar" para adicionar nota'
                    rows={4}
                  />
                )}
              </Box>
              <Box sx={{ alignSelf: 'end' }}>
                <Button onClick={() => navigate(`/profile/edit/${userId}`)}>Editar</Button>
                {isAdmin && (
                  <IconButton color={componentProps.color.inherit} aria-label='open settings modal' onClick={() => setIsSettingsModalOpen(true)}>
                    <SettingsIcon fontSize={componentProps.fontSize.medium} color={componentProps.color.primary} />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>

          <Button variant={componentProps.variant.outlined} onClick={showOrders}>
            Histórico de pedidos
          </Button>

          {!isLoadingOrders && (
            <Box sx={!isVisible ? profileClasses.ordersNotVisible : {}} ref={ordersRef}>
              <Masonry breakpointCols={profileClasses.breakpoints} className='my-masonry-grid' columnClassName='my-masonry-grid_column'>
                {userOrders.length > 0 &&
                  userOrders.map((order) => {
                    return (
                      <Box sx={{ mt: 4 }} key={order._id}>
                        <ShopOrder order={order} />
                      </Box>
                    );
                  })}
              </Masonry>
              {userOrders.length === 0 && (
                <Typography paragraph sx={{ mt: 4 }}>
                  Nenhum pedido encontrado.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}
      {isLoadingOrders && <CircularProgress sx={{ mt: 4 }} size='80px' />}
      <SettingsModal isModalOpen={isSettingsModalOpen} setIsModalOpen={setIsSettingsModalOpen} />
    </Box>
  );
};

export default ProfilePage;
