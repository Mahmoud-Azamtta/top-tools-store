import "dotenv/config";
import express from "express";

import initApp from "./src/modules/app.router.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.ENDPOINTSECRET,
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type !== "checkout.session.completed") {
      console.log(`Unhandled event type ${event.type}`);
      const checkoutSessionCompleted = event.data.object;
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }
    // Handle the event

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);
initApp(app, express);
app.listen(PORT, () => {
  console.log(`server is running ... ${PORT}`);
});

