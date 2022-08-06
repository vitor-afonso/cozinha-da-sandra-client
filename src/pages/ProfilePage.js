// jshint esversion:9

import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { ShopOrder } from '../components/ShopOrder';
import { AuthContext } from '../context/auth.context';

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { shopUsers } = useSelector((store) => store.users);
  const { shopOrders } = useSelector((store) => store.orders);
  const [profileOwner, setProfileOwner] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { userId } = useParams();

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
    <div>
      {profileOwner && shopOrders && (
        <>
          <h2>Perfil</h2>

          <div>
            <div>
              <img src={profileOwner.imageUrl} alt={profileOwner.username} style={{ width: '150px', height: 'auto' }} />
            </div>
            <p>
              <b>Username: </b>
              {profileOwner.username}
            </p>
            <p>
              <b>Email: </b>
              {profileOwner.email}
            </p>
            <p>
              <b>Password: </b>********
            </p>
            <p>
              <b>Contacto: </b>
              {profileOwner.contact}
            </p>
            {user.userType === 'admin' && (
              <p>
                <b>Info: </b> {profileOwner.info}
              </p>
            )}
          </div>

          {userOrders.length > 0 && (
            <div>
              <h3 onClick={showOrders}>Historico de encomendas</h3>
              <div className={`${!isVisible && 'profile-orders'}`}>
                {userOrders &&
                  userOrders.map((order) => {
                    return <ShopOrder key={order._id} order={order} />;
                  })}
              </div>
            </div>
          )}

          <div>
            {user._id === userId && <Link to={`/profile/edit/${userId}`}>Editar Perfil</Link>}
            {user.userType === 'admin' && user._id !== userId && <Link to={`/profile/edit/${userId}`}>Editar User Info</Link>}
          </div>
        </>
      )}
    </div>
  );
};
