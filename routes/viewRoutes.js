const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  // bookingController.createBookingcheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/my-profile', authController.protect, viewController.getAccount);
router.get('/my-bookings', authController.protect, viewController.getBookings);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);
router.get(
  '/:slug/create-review',
  authController.protect,
  viewController.getReviewForm
);

module.exports = router;
