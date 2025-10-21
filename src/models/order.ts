const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    // product relation is optional; webhook may only have SKU/metadata
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    variantSku: { type: String, required: false },
    name: String,
    unitPrice: Number, // cents
    quantity: Number,
    metadata: { type: Object, default: {} }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, index: true },
    customerEmail: String,
    items: [OrderItemSchema],
    totalAmount: Number, // cents
    currency: String,
    status: { type: String, default: 'created' },
    source: String,
    stripeInvoiceId: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
