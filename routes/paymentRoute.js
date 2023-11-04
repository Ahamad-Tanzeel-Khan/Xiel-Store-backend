import express from "express";
const payment_route = express();

import bodyParser from 'body-parser';
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

payment_route.set('view engine','ejs');
payment_route.set('views',path.join(__dirname, '../views'));

import {checkout, paymentVerification, paymentSuccess} from '../controllers/paymentController.js';

payment_route.post('/checkout', checkout);
payment_route.post('/paymentverification', paymentVerification);
payment_route.post('/paymentsuccess', paymentSuccess);

export default payment_route;