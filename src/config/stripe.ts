import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export function getStripe() {
    return stripe;
}

// helper to ensure customer exists
export async function getOrCreateCustomer(email: string, metadata = {}) {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length) return customers.data[0];
    return await stripe.customers.create({ email, metadata });
}
