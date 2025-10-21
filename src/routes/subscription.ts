import express from 'express';
import bodyParser from 'body-parser';
import { getStripe, getOrCreateCustomer } from '../config/stripe';
import Order from '../models/order';
import Product from '../models/product';

const router = express.Router();
const stripe = getStripe();

// Create a subscription (frontend passes priceId and customer email)
router.post('/create-subscription', async (req, res) => {
    // expected body: { email, priceId, payment_method_id (optional) }
    const { email, priceId, payment_method_id } = req.body;
    if (!email || !priceId) return res.status(400).json({ error: 'Missing fields' });

    try {
        const customer = await getOrCreateCustomer(email);

        // attach payment method if provided
        if (payment_method_id) {
            await stripe.paymentMethods.attach(payment_method_id, { customer: customer.id });
            await stripe.customers.update(customer.id, {
                invoice_settings: { default_payment_method: payment_method_id }
            });
        }

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            expand: ['latest_invoice.payment_intent'],
            metadata: { shop: 'nutrition-shop' }
        });

        return res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice?.payment_intent?.client_secret || null,
            status: subscription.status
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Subscription creation failed' });
    }
});

// Stripe webhook endpoint (configure endpoint in Stripe dashboard)
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: any, res: any) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        return res.status(400).send(`Webhook Error: ${err}`);
    }

    try {
        switch (event.type) {
            case 'invoice.payment_succeeded': {
                const invoice: any = event.data.object;

                // attempt to get customer email
                let customerEmail = invoice.customer_email;
                try {
                    if (!customerEmail && invoice.customer) {
                        const cust = await stripe.customers.retrieve(invoice.customer);
                        if ((cust as any).email) customerEmail = (cust as any).email;
                    }
                } catch (e) {
                    console.warn('Could not fetch customer email from Stripe', e);
                }

                // Build items from invoice lines
                const lines = invoice.lines?.data || [];
                const items: any[] = [];
                for (const ln of lines) {
                    const qty = ln.quantity || 1;
                    const unitPrice = ln.price?.unit_amount || ln.amount || 0;
                    const metadata = ln.price?.metadata || ln.metadata || {};
                    const variantSku = metadata.variant_sku || metadata.sku || null;
                    const name = ln.description || ln.price?.nickname || 'Item';

                    items.push({
                        name,
                        variantSku,
                        unitPrice,
                        quantity: qty,
                        metadata
                    });
                }

                // Save order
                const orderNumber = `ORD-${Date.now()}`;
                const totalAmount = invoice.amount_paid || invoice.total || 0;
                const currency = invoice.currency || 'usd';

                const orderDoc = new Order({
                    orderNumber,
                    customerEmail,
                    items,
                    totalAmount,
                    currency,
                    status: 'paid',
                    source: 'stripe',
                    stripeInvoiceId: invoice.id
                });
                await orderDoc.save();

                // Attempt inventory decrement for matching variant SKUs
                for (const it of items) {
                    if (!it.variantSku) continue;
                    try {
                        await Product.updateOne(
                            { 'variants.sku': it.variantSku },
                            { $inc: { 'variants.$.inventory': -Math.max(0, it.quantity) } }
                        ).exec();
                    } catch (err) {
                        console.warn('Inventory decrement failed for sku', it.variantSku, err);
                    }
                }

                console.log('Created order from invoice', orderDoc._id);
                break;
            }
            case 'invoice.payment_failed':
                // ...existing handling for failed payments (if any)...
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (err) {
        console.error('Error processing webhook event', err);
    }

    res.json({ received: true });
});

export default router;
	}

res.json({ received: true });
});

export default router;
