const express = require("express");
const { createOrder, verifyPayment } = require("../Controllers/paymentController");

const router = express.Router();

// Routes for Razorpay payment
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;
