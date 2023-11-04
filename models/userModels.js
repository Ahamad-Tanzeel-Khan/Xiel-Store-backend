import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
},{timestamps:true});

const User = mongoose.model('users', userSchema);

// Payment Database

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

//Customer Details

const customerSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
  },
  customer_email: {
    type: String,
    required: true,
  },
  customer_country: {
    type: String,
    required: true,
  },
  customer_state: {
    type: String,
    required: true,
  },
  customer_city: {
    type: String,
    required: true,
  },
  customer_address: {
    type: String,
    required: true,
  },
  customer_zipcode: {
    type: String,
  },
  customer_contact: {
    type: Number,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

//Bought Product

const shoppingSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
  },
  customer_email: {
    type: String,
    required: true,
  },
  products_bought: {
    type: Array,
    required: true,
  },

  total_price: {
    type: Number,
    required: true,
  },
});

const Shopping = mongoose.model("Shopping", shoppingSchema);

export {
    User,
  Payment,
  Customer,
  Shopping,
};

