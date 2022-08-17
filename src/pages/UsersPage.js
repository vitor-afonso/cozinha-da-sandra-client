// jshint esversion:9

import { DeleteOutlined } from '@mui/icons-material';
import { Box, CircularProgress, TextField, Typography, Card, CardHeader, Avatar, IconButton, Stack, Paper } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

export const UsersPage = () => {
  const { user } = useContext(AuthContext);
  const { shopUsers, isLoading } = useSelector((store) => store.users);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [str, setStr] = useState('');
  const effectRan = useRef(false);
  const navigate = useNavigate();

  const usersClasses = {
    container: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      px: 3,
    },
    top: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    field: {
      minWidth: '300px',
      maxWidth: '600px',
      marginTop: 0,
      marginBottom: 5,
      display: 'block',
    },
    bottom: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    avatarContainer: {
      width: '100%',
      maxWidth: '600px',
      display: 'flex',
      alignItems: 'center',
      padding: 1,
      backgroundColor: '#ECE8ED',
      cursor: 'pointer',
    },
    deletedAvatarContainer: {
      width: '100%',
      maxWidth: '600px',
      display: 'flex',
      alignItems: 'center',
      padding: 1,
      backgroundColor: '#ddd',
      cursor: 'pointer',
    },
    avatar: {
      width: '40px',
      height: 'auto',
      backgroundColor: '#FFF',
      padding: 1,
      mr: 3,
    },
  };

  useEffect(() => {
    if (effectRan.current === false) {
      setFilteredUsers(shopUsers);

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  useEffect(() => {
    if (str === '') {
      setFilteredUsers(shopUsers);
    } else {
      let filteredUsers = shopUsers.filter((user) => user.username.toLowerCase().includes(str.toLowerCase()));
      setFilteredUsers(filteredUsers);
    }
  }, [str]);

  return (
    <Box sx={usersClasses.container}>
      <Box sx={usersClasses.top}>
        <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
          Utilizadores
        </Typography>

        <TextField label='Procurar' type='text' variant='outlined' fullWidth sx={usersClasses.field} onChange={(e) => setStr(e.target.value)} />
      </Box>

      {isLoading && <CircularProgress sx={{ mt: 20 }} />}
      <Stack spacing={2} sx={usersClasses.bottom}>
        {!isLoading &&
          filteredUsers.map((oneUser) => {
            if (oneUser._id !== user._id) {
              if (oneUser.deleted) {
                return (
                  <Paper elevation={2} key={oneUser._id} sx={usersClasses.deletedAvatarContainer} onClick={() => navigate(`/profile/${oneUser._id}`)}>
                    <Avatar src={oneUser.imageUrl} alt={oneUser.username} sx={usersClasses.avatar} />
                    <Typography color='textSecondary' sx={{ fontSize: '18px' }}>
                      {oneUser.username}
                    </Typography>
                  </Paper>
                );
              }
              return (
                <Paper elevation={1} key={oneUser._id} sx={usersClasses.avatarContainer} onClick={() => navigate(`/profile/${oneUser._id}`)}>
                  <Avatar src={oneUser.imageUrl} alt={oneUser.username} sx={usersClasses.avatar} />

                  <Typography color='secondary' sx={{ fontSize: '18px' }}>
                    {oneUser.username}
                  </Typography>
                </Paper>
              );
            }
          })}
      </Stack>
    </Box>
  );
};
