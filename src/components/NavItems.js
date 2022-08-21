// jshint esversion:9
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ListItemIcon from '@mui/material/ListItemIcon';

export const NavItems = () => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <List sx={{ display: { md: 'flex', flexGrow: 1 } }}>
      {!isLoggedIn && (
        <>
          <ListItem disablePadding onClick={() => navigate('/')}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <HomeOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/doces')}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <CakeOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary={'Doces'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/salgados')}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <LocalPizzaOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary={'Salgados'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/signup')}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <AppRegistrationOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary={'Registrar'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/login')}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <LoginOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary={'Entrar'} />
            </ListItemButton>
          </ListItem>
        </>
      )}

      {isLoggedIn && user && (
        <>
          <ListItem disablePadding onClick={() => navigate('/')}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <HomeOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/doces')}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <CakeOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary={'Doces'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => navigate('/salgados')}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <LocalPizzaOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary={'Salgados'} />
            </ListItemButton>
          </ListItem>

          {user.userType === 'admin' && (
            <ListItem disablePadding onClick={() => navigate('/users')}>
              <ListItemButton>
                <ListItemIcon sx={{ display: { md: 'none' } }}>
                  <PeopleAltOutlinedIcon color='primary' />
                </ListItemIcon>
                <ListItemText primary={'Utilizadores'} />
              </ListItemButton>
            </ListItem>
          )}

          {user.userType === 'admin' && (
            <ListItem disablePadding onClick={() => navigate('/orders')}>
              <ListItemButton>
                <ListItemIcon sx={{ display: { md: 'none' } }}>
                  <ListAltOutlinedIcon color='primary' />
                </ListItemIcon>
                <ListItemText primary={'Pedidos'} />
              </ListItemButton>
            </ListItem>
          )}

          {user.userType === 'admin' && (
            <ListItem disablePadding onClick={() => navigate('/items/add')}>
              <ListItemButton>
                <ListItemIcon sx={{ display: { md: 'none' } }}>
                  <AddCircleOutlineOutlinedIcon color='primary' />
                </ListItemIcon>
                <ListItemText primary={'Criar Item'} sx={{ whiteSpace: 'nowrap' }} />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding onClick={() => navigate(`/profile/${user._id}`)}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <AccountCircleOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary={'Perfil'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={() => logOutUser()}>
            <ListItemButton>
              <ListItemIcon sx={{ display: { md: 'none' } }}>
                <LogoutOutlinedIcon color='primary' />
              </ListItemIcon>
              <ListItemText primary='Sair' />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </List>
  );
};
