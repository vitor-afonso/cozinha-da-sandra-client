//jshint esversion:9

import axios from 'axios';

const API_URL = `${process.env.REACT_APP_PROJECT_API}/api`;

/************************* USERS *****************************/

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

export const getOneItem = (id) => {
  return axios.get(`${API_URL}/items/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const updateItem = (updatedItem, itemId) => {
  return axios.put(`${API_URL}/items/edit/${itemId}`, updatedItem, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

export const deleteItem = (id) => {
  return axios.delete(`${API_URL}/items/delete/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });
};

/************************* ORDERS *****************************/

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
