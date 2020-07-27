/* eslint-disable */

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout, signup } from './login';
import { reviewTour } from './review';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripePayments';
import { showAlert } from './alerts';

const mapBox = document.getElementById('map');
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const reviewForm = document.querySelector('.form--review');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confitmPassword').value;
    signup(name, email, password, confirmPassword);
  });
}

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

const ratingStars = document.querySelectorAll('.rating-star-container');
let rating = 0;
let activeStars = [];
ratingStars.forEach((el) => {
  activeStars.push(el.firstChild);
  el.addEventListener('click', (e) => {
    rating = e.target.dataset.ratingStars;
    activeStars.forEach((el) => {
      if (el.dataset.ratingStars < rating) {
        el.setAttribute('class', 'reviews__star reviews__star--active');
      }
      e.target.setAttribute('class', 'reviews__star reviews__star--active');
    });
    return rating;
  });
});

if (reviewForm)
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tourId = reviewForm.dataset.id;
    const review = document.getElementById('review').value;
    reviewTour(tourId, review, rating);
  });

const alertMessage = document.querySelector('body').dataset.alert;

if (alertMessage) showAlert('success', alertMessage);
