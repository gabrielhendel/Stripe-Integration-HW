const express = require("express");
const app = express();
// This is your real test secret API key.
const stripe = require("stripe")("sk_test_51IHwhZK0JNi9uTXDFHj4vq2NwymOUNWucxOEI8w3ZHFRLorpoc9E5VvpcBG8VsDWmBfVfsslddgzrAEM06YV9q3F00lMOseORs");

app.use(express.static("."));
app.use(express.json());

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

/**
 * Configurations of logger.
 */
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

app.post("/log-successful-payment", async (req, res) => {
  const result = req.body;
  logger.info("Kaching! A successful payment was logged!" + result.paymentIntent.amount + result.paymentIntent.currency)

  res.send("Hello world");
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
