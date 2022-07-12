//jshint esversion:9

import axios from 'axios';

const API_URL = `${process.env.REACT_APP_PROJECT_API}/api`;

/************************* HomePage ****************************/

export const getActiveItems = () => {
  return axios.get(`${API_URL}/`);
};

/************************* USERS *****************************/

export const getAllUsers = () => {
  return axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const getOneUser = (userId) => {
  return axios.get(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const updateUser = (updatedUser, userId) => {
  return axios.put(`${API_URL}/users/edit/${userId}`, updatedUser, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const deleteUser = (userId) => {
  return axios.put(
    `${API_URL}/users/delete/${userId}`,
    { deleted: true },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    }
  );
};

/************************* ITEMS *****************************/

export const addItem = (item) => {
  return axios.post(`${API_URL}/items`, item, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const getAllItems = () => {
  return axios.get(`${API_URL}/items`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const getOneItem = (itemId) => {
  return axios.get(`${API_URL}/items/${itemId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const updateItem = (updatedItem, itemId) => {
  return axios.put(`${API_URL}/items/edit/${itemId}`, updatedItem, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const deleteItem = (itemId) => {
  return axios.put(
    `${API_URL}/items/delete/${itemId}`,
    { deleted: true },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    }
  );
};

/************************* ORDERS *****************************/

export const createOrder = (order) => {
  return axios.post(`${API_URL}/orders`, order, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const getAllOrders = () => {
  return axios.get(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const getOneOrder = (id) => {
  return axios.get(`${API_URL}/orders/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const updateOrder = (updatedOrder, orderId) => {
  return axios.put(`${API_URL}/orders/edit/${orderId}`, updatedOrder, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const deleteOrder = (orderId) => {
  return axios.put(
    `${API_URL}/orders/delete/${orderId}`,
    { deleted: true },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    }
  );
};

/************************* UPLOAD IMAGE *****************************/

export const uploadImage = async (file) => {
  try {
    let res = await axios.post(`${API_URL}/upload`, file, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

/************************* AUTH *****************************/

export const signup = (user) => {
  return axios.post(`${API_URL}/signup`, user);
};

export const login = (user) => {
  return axios.post(`${API_URL}/login`, user);
};

export const verify = (storedToken) => {
  return axios.get(`${API_URL}/verify`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};
