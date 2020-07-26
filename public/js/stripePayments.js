/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51H739AE5ixecAG7LmKUGy3X5xogylfgAXMlb45kGAzjkY0U8VlvHI6cprceTvjwPmgSWUfoHTkdiseyjoD5uK2QS00XDQyJEMZ'
);

export const bookTour = async (tourID) => {
  try {
    // 1) Get session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourID}`
    );

    // 2) Use stripe object to create checkout form and charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.error(err);
  }
};
