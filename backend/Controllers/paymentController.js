const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");

// Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_Hwm7AAKC5Yu1y3", // Use your Razorpay test key here
  key_secret: "CvmoDfz4DFu3nolekTKnabGj", // Use your Razorpay test secret key here
});

// Controller to create a Razorpay order
const createOrder = async (req, res) => {
  try {
    const amount = 5000;
    // console.log(amount);
     // Set static amount (5000 INR)

    // Razorpay order options
    const options = {
      amount: amount * 100, // Amount in paise (5000 INR = 500000 paise)
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`, // Use timestamp for unique receipt
      payment_capture: 1, // Auto-capture payment
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    // Save payment data with status "created"
    const payment = new Payment({
      razorpayOrderId: order.id,
      amount,
      status: "created",
    });
    await payment.save();

    // Respond with order details
    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Order creation failed.",
      error: error.message, // Return specific error message for debugging
    });
  }
};

// Controller to verify Razorpay payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature using SHA256 HMAC
    const generated_signature = crypto
      .createHmac("sha256", "CvmoDfz4DFu3nolekTKnabGj") // Use your Razorpay test secret key here
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Update payment status to "paid"
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        status: "paid",
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Payment verified successfully", payment });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Payment verification failed." });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
