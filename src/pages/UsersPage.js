// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'context/auth.context';
import { Box, CircularProgress, TextField, Typography, Avatar, Stack, Paper, InputAdornment } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { componentProps, usersClasses } from 'utils/app.styleClasses';

const IS_MOBILE = window.innerWidth < 600 ? true : false;
const HEADING_VARIANT = IS_MOBILE ? 'h3' : 'h2';

const UsersPage = () => {
  const { user } = useContext(AuthContext);
  const { shopUsers, isLoading } = useSelector((store) => store.users);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [str, setStr] = useState('');
  const effectRan = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (effectRan.current === false && shopUsers.length > 0) {
      setFilteredUsers(shopUsers);

      return () => {
        effectRan.current = true;
      };
    }
  }, [shopUsers]);

  useEffect(() => {
    if (str === '' && shopUsers.length > 0) {
      setFilteredUsers(shopUsers);
    } else {
      let filteredUsers = shopUsers.filter((user) => user.username.toLowerCase().includes(str.toLowerCase()));
      setFilteredUsers(filteredUsers);
    }
  }, [str, shopUsers]);

  return (
    <Box sx={usersClasses.container}>
      <Box sx={usersClasses.top}>
        <Typography variant={HEADING_VARIANT} color={componentProps.color.primary} sx={{ my: 4 }}>
          UTILIZADORES
        </Typography>

        <TextField
          label='Procurar'
          type={componentProps.type.text}
          variant={componentProps.variant.outlined}
          fullWidth
          sx={usersClasses.field}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setStr(e.target.value)}
          autoComplete='true'
        />
      </Box>

      {isLoading && <CircularProgress sx={{ mt: 20 }} size='80px' />}

      <Stack spacing={2} sx={usersClasses.bottom}>
        {!isLoading &&
          filteredUsers.map((oneUser) => {
            if (oneUser._id !== user._id) {
              if (oneUser.deleted) {
                return (
                  <Paper elevation={2} key={oneUser._id} sx={usersClasses.deletedAvatarContainer} onClick={() => navigate(`/profile/${oneUser._id}`)}>
                    <Avatar src={oneUser.imageUrl} alt={oneUser.username} sx={usersClasses.avatar} />
                    <Typography color='textSecondary' sx={{ fontSize: 18 }}>
                      {oneUser.username}
                    </Typography>
                  </Paper>
                );
              }
              return (
                <Paper elevation={1} key={oneUser._id} sx={usersClasses.avatarContainer} onClick={() => navigate(`/profile/${oneUser._id}`)}>
                  <Avatar src={oneUser.imageUrl} alt={oneUser.username} sx={usersClasses.avatar} />

                  <Typography color={componentProps.color.secondary} sx={{ fontSize: 18 }}>
                    {oneUser.username}
                  </Typography>
                </Paper>
              );
            }
            return null;
          })}
      </Stack>
    </Box>
  );
};

export default UsersPage;
