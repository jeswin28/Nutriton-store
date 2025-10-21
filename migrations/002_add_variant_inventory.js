// Run with: node migrations/002_add_variant_inventory.js
const mongoose = require('mongoose');
require('dotenv').config();

let ProductMod = null;
try {
    ProductMod = require('../src/models/product');
} catch (e) {
    console.error('Could not require ../src/models/product directly', e);
    process.exit(1);
}
const Product = ProductMod.default || ProductMod;

async function run() {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // iterate products and ensure each variant has an 'inventory' numeric field
    const cursor = Product.find({}).cursor();
    let updated = 0;
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        let modified = false;
        if (Array.isArray(doc.variants)) {
            for (let v of doc.variants) {
                if (typeof v.inventory !== 'number') {
                    v.inventory = 0;
                    modified = true;
                }
            }
        }
        if (modified) {
            await doc.save();
            updated++;
        }
    }
    console.log('Products updated with variant inventory default:', updated);
    await mongoose.disconnect();
}
run().catch(err => { console.error(err); process.exit(1); });
