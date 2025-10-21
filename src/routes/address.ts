import express from 'express';
import { validateAddressWithGoogle } from '../config/google';
const router = express.Router();

router.post('/validate', async (req, res) => {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: 'address required' });

    try {
        const result = await validateAddressWithGoogle(address);
        // return normalized address and flags (deliverability)
        return res.json({ ok: true, result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Address validation failed' });
    }
});

export default router;
