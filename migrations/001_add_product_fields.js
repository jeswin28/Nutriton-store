// Run with: node migrations/001_add_product_fields.js
const mongoose = require('mongoose');
require('dotenv').config();

// resilient import for CJS/ESM interop
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

    const res = await Product.updateMany(
        {},
        {
            $set: {
                allergens: [],
                certifications: [],
                dosage: {},
                ingredientList: '',
                nutritionalFacts: {},
                complianceText: '',
                allergenWarningRemoved: false,
                allergenWarningAudit: {},
            }
        }
    );

    // different mongoose versions return different shapes
    console.log('Migration result:', {
        n: res.n || res.matchedCount,
        nModified: res.nModified || res.modifiedCount
    });

    await mongoose.disconnect();
}
run().catch(err => { console.error(err); process.exit(1); });
