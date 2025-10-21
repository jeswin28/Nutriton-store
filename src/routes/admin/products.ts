import express from 'express';
import Product from '../../models/product'; // adjust relative path if needed

const router = express.Router();

// Basic admin guard middleware (adapt to your auth system)
function requireAdmin(req: any, res: any, next: any) {
    // expect req.user to be populated by your auth middleware
    if (req.user && req.user.isAdmin) return next();
    // for ease of testing, allow if env var SKIP_ADMIN_CHECK set
    if (process.env.SKIP_ADMIN_CHECK === 'true') return next();
    return res.status(403).json({ error: 'Admin access required' });
}

// Update product fields (allowed fields only)
router.put('/:id', requireAdmin, async (req: any, res: any) => {
    const id = req.params.id;
    const allowed = [
        'title', 'slug', 'price', 'allergens', 'certifications', 'dosage',
        'ingredientList', 'nutritionalFacts', 'complianceText', 'images', 'variants'
    ];
    const payload: any = {};
    for (const k of allowed) if (k in req.body) payload[k] = req.body[k];

    try {
        const updated = await Product.findByIdAndUpdate(id, { $set: payload }, { new: true });
        if (!updated) return res.status(404).json({ error: 'Product not found' });
        return res.json({ ok: true, product: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Update failed' });
    }
});

// Remove allergen warning with audit info
router.post('/:id/allergen-warning', requireAdmin, async (req: any, res: any) => {
    const id = req.params.id;
    const { reason } = req.body;
    const adminUser = req.user ? (req.user.email || req.user.id || 'admin') : 'system';

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        product.allergenWarningRemoved = true;
        product.allergenWarningAudit = {
            removedBy: adminUser,
            removedAt: new Date(),
            reason: reason || ''
        };
        await product.save();
        return res.json({ ok: true, product });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not update allergen warning' });
    }
});

export default router;
