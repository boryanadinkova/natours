/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'You logged in successfully');
      window.setTimeout(() => {
        location.assign(document.referrer);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/login',
    });
    if (res.data.status === 'success') {
      location.reload(true);
      location.assign('/login');
    }
  } catch (err) {
    showAlert('error', 'Error logging out. Please try again!');
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'You logged in successfully');
      window.setTimeout(() => {
        location.assign(document.referrer);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
