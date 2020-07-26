/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const reviewTour = async (tourID, review, rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/tours/${tourID}/reviews`,
      data: {
        review,
        rating,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Your review has been added');
      window.setTimeout(() => {
        location.assign('/my-reviews');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
