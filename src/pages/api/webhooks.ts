/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscriptions";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}


// Isso por que o next tem um entendimento padrão do que vem da requisição, e acaba tentando fazer o parser dela.
// No caso do stream precisamos desabilitar isso
// https://nextjs.org/docs/api-routes/api-middlewares
export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed'
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const buf = await buffer(req)

    const secret = req.headers['stripe-signature']

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
      return res.status(400).send(`Webhook error: ${error.message}`)
    }


    const {type} = event;

    if(relevantEvents.has(type)) {
      try {
        switch(type){
          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription.toString(), 
              checkoutSession.customer.toString()
              )
            break;
          default:
            throw new Error('Unhandled event');  
        }
      } catch (error) {
        return res.json({error: 'Webhook hanfled failed.'})
      }
      // console.log('Evento recebido: ', event)
    }

    return res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
