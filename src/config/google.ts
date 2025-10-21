import fetch from 'node-fetch';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function validateAddressWithGoogle(address: string) {
    // Using the Address Validation API endpoint
    // See: https://developers.google.com/maps/documentation/address-validation
    const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${GOOGLE_API_KEY}`;
    const body = {
        address: { addressLines: [address] },
        enableUspsCass: false
    };
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Google API error: ${text}`);
    }
    const data = await res.json();
    // data.result has normalizedAddress and markers for deliverability
    return data;
}
