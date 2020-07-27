const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get data
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review, rating, user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with this name.', 404));
  }

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIds = bookings.map((el) => el.tour);
  const bookedTours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('bookings', {
    title: 'My Tours',
    bookedTours,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });

  res.status(200).render('reviews', {
    title: 'My Reviews',
    reviews,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login to your account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your Natours account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My account',
  });
};

exports.getReviewForm = catchAsync(async (req, res) => {
  const reviewTour = await Tour.findOne({ slug: req.params.slug });

  res.status(200).render('reviewForm', {
    title: 'Review',
    reviewTour,
  });
});
