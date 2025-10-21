import mongoose from 'mongoose';

const DosageSchema = new mongoose.Schema({
    amount: { type: Number },
    unit: { type: String },
    instructions: { type: String }
}, { _id: false });

const NutritionalFactsSchema = new mongoose.Schema({
    imageUrl: { type: String },
    macros: {
        protein: Number,
        carbs: Number,
        fat: Number
    },
    calories: Number,
    // additional structured fields can be added as needed
}, { _id: false });

const AllergenAuditSchema = new mongoose.Schema({
    removedBy: String,
    removedAt: Date,
    reason: String
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    // ...existing code...
    title: String,
    slug: String,
    price: Number,
    variants: [/* ...existing code... */],

    // New structured fields
    allergens: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    dosage: { type: DosageSchema, default: {} },
    ingredientList: { type: String, default: '' },
    nutritionalFacts: { type: NutritionalFactsSchema, default: {} },
    complianceText: { type: String, default: '' },

    // admin control to remove allergen warning with audit trail
    allergenWarningRemoved: { type: Boolean, default: false },
    allergenWarningAudit: { type: AllergenAuditSchema, default: {} },

    // image management: high-res product images and metadata
    images: [{
        url: String,
        alt: String,
        highres: Boolean,
        sortOrder: Number
    }]
    // ...existing code...
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);