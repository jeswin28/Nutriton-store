const fs = require('fs');
const path = require('path');

const rows = [
    // Category, Trigger, Developer Work
    ['Product & Catalog Management', 'Admin adds a new flavor/size of protein.', 'Product Variant Management: handle multiple product options (Flavor, Size) linked to one product.'],
    ['Product & Catalog Management', 'Admin needs to update a product label.', 'Dynamic Content/Image Management: upload/display high-res zoomable images and Nutritional Facts Panel.'],
    ['Product & Catalog Management', 'Admin wants to remove an allergen warning.', 'Product Data Schema: structured fields for allergens, dosage, certifications, compliance text.'],
    ['Product & Catalog Management', 'User searches for "whey protein for women."', 'Robust Search & Filtering: search engine with facet filtering and intelligent ranking.'],

    ['Shopping & Conversion', 'User adds an item to the cart.', 'Shopping Cart Logic: handle quantities, totals, session persistence, coupons.'],
    ['Shopping & Conversion', 'User wants to buy a product regularly.', 'Subscription System Integration: recurring billing, customer portal, automated orders.'],
    ['Shopping & Conversion', 'User views a product page.', 'Personalization Engine: AI recommendations (cross-sell/upsell).'],
    ['Shopping & Conversion', 'User leaves the site without buying.', 'Abandonment Tracking: event tracking for abandoned carts for marketing.'],

    ['Checkout & Payment', 'User enters payment information.', 'Payment Gateway Integration: Stripe/PayPal secure card and wallet processing.'],
    ['Checkout & Payment', 'User clicks "Place Order."', 'Order Processing Logic: validate order, inventory deduction, unique order ID.'],
    ['Checkout & Payment', 'User submits an incorrect address.', 'Address Validation API: integrate address normalization/validation (Google/SmartyStreets).'],
    ['Checkout & Payment', 'Admin changes shipping rates.', 'Shipping & Tax Logic: complex shipping rules and automated tax calculation.'],

    ['Trust & Post-Purchase', 'User receives the product.', 'Review System Integration: post-purchase review requests and moderation tools.'],
    ['Trust & Post-Purchase', 'Admin needs to check a shipment status.', 'Order/Shipping API Integration: connect with carrier APIs for tracking.'],
    ['Trust & Post-Purchase', 'User has a question on a product page.', 'Live Chat/Support Widget Integration: embed third-party support tool.'],
    ['Trust & Post-Purchase', 'User tries to access personal info.', 'Security Implementation: TLS, secure auth, audits.'],

    ['Administration & Performance', 'Admin logs in to manage the store.', 'Admin Dashboard Development: UI for orders, inventory, customers, content.'],
    ['Administration & Performance', 'Admin launches a new email campaign.', 'Marketing Platform Integration: hooks for email/CRM/analytics (GA4, Klaviyo).'],
    ['Administration & Performance', 'User navigates the site on a phone.', 'Responsive Design & Performance Optimization: mobile-first, fast-loading UI.']
];

// ensure exports dir exists
const outDir = path.join(__dirname, '..', 'exports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// write JSON
const jsonPath = path.join(outDir, 'triggers.json');
fs.writeFileSync(jsonPath, JSON.stringify(rows.map(r => ({ category: r[0], trigger: r[1], developerWork: r[2] })), null, 2), 'utf8');

// write CSV (simple escaping)
const csvPath = path.join(outDir, 'triggers.csv');
function escapeCell(s) {
    if (s == null) return '';
    const str = String(s);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}
const header = ['Category', 'Trigger', 'Developer Work'].map(escapeCell).join(',');
const csvLines = [header].concat(rows.map(r => r.map(escapeCell).join(',')));
fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');

console.log('Wrote', jsonPath, 'and', csvPath);
