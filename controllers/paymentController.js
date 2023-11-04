import Razorpay  from "razorpay";
import crypto  from "crypto";
import { Payment, Customer, Shopping }  from "../models/userModels.js";

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razor = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

const checkout = async (req, res) => {
  try {
    const amount = Number(req.body.amount * 100);
    const options = {
      amount: amount,
      currency: "INR",
      receipt: "razorUser@gmail.com",
    };

    razor.orders.create(options, (err, order) => {
      if (!err) {
        res.status(200).send({
          success: true,
          order,
        });
      } else {
        res.status(400).send({ success: false, msg: "Something went wrong!" });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `${process.env.CLIENT_URL_PORT}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

const paymentSuccess = async (req, res) => {
  const products = req.body.products;
  const totalPrice = req.body.totalPrice;

  await Customer.create({
    customer_name: req.body.name,
    customer_email: req.body.email,
    customer_country: req.body.selectedCountry,
    customer_state: req.body.state,
    customer_city: req.body.city,
    customer_address: req.body.address,
    customer_zipcode: req.body.zip,
    customer_contact: req.body.phoneNo,
  });

  await Shopping.create({
    customer_name: req.body.name,
    customer_email: req.body.email,
    products_bought: products,
    total_price: totalPrice,
  });
};

export {
  checkout,
  paymentVerification,
  paymentSuccess,
};
