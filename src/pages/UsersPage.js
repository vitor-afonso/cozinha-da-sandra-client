// jshint esversion:9

import { Box, CircularProgress, TextField, Typography } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

export const UsersPage = () => {
  const { user } = useContext(AuthContext);
  const { shopUsers, isLoading } = useSelector((store) => store.users);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [str, setStr] = useState('');
  const effectRan = useRef(false);

  const usersClasses = {
    container: {
      display: 'flex',
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
      fontSize: '20px',
      display: 'block',
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

      {/* {!isLoading && (
        filteredUsers.map((oneUser) => {
          if (oneUser._id !== user._id) {
            if (oneUser.deleted) {
              return (
                <div key={oneUser._id}>
                  <div>
                    <img src={oneUser.imageUrl} alt={oneUser.username} />
                  </div>
                  <Link to={`/profile/${oneUser._id}`}>
                    <span style={{ color: 'lightgrey' }}>{oneUser.username}</span>
                  </Link>
                </div>
              );
            }
            return (
              <div key={oneUser._id}>
                <div>
                  <img src={oneUser.imageUrl} alt={oneUser.username} />
                </div>
                <Link to={`/profile/${oneUser._id}`}>
                  <span>{oneUser.username}</span>
                </Link>
              </div>
            );
          }
        })
      ) } */}
    </Box>
  );
};
