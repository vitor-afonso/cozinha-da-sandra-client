// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../api';
import { AuthContext } from '../context/auth.context';

export const UsersPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [str, setStr] = useState('');

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      (async () => {
        let { data } = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      })();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  useEffect(() => {
    if (str === '') {
      setFilteredUsers(users);
    } else {
      let filteredUsers = users.filter((user) => user.username.toLowerCase().includes(str.toLowerCase()));
      setFilteredUsers(filteredUsers);
    }
  }, [str]);

  return (
    <div>
      <div>
        <label htmlFor='search'>
          <h2>Procurar Utilizadores</h2>
        </label>
        <input type='text' placeholder='Nome de utilizador' name='search' value={str} onChange={(e) => setStr(e.target.value)} />
      </div>

      <br />

      {users &&
        filteredUsers.map((oneUser) => {
          if (oneUser._id !== user._id) {
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
        })}
    </div>
  );
};
