// Minimal Express app that mounts the admin products router at /api/admin/products
// and provides a simple auth middleware to populate req.user for admin routes.
// Adjust paths to your project structure if different.
// Do not use SKIP_ADMIN_CHECK=true in production.

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Replace simple populateUser with a JWT-based authenticateUser middleware.
// This verifies Authorization: Bearer <token> using process.env.JWT_SECRET and sets req.user.
// In dev only, SKIP_ADMIN_CHECK=true will set a test admin user (do NOT use in production).
const jwt = require('jsonwebtoken');

function authenticateUser(req, res, next) {
    // Dev bypass for quick testing (do NOT enable in production)
    if (process.env.SKIP_ADMIN_CHECK === 'true') {
        req.user = { isAdmin: true, email: 'dev@local' };
        return next();
    }

    // Check Authorization header for Bearer token
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
        const token = auth.slice(7).trim();
        if (!token) return next();
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.warn('JWT_SECRET not set; cannot verify tokens. Falling through without user.');
            return next();
        }
        try {
            const payload = jwt.verify(token, secret);
            // expected payload to contain { sub, email, roles... } — adapt to your token shape
            req.user = {
                id: payload.sub || payload.id,
                email: payload.email,
                isAdmin: Array.isArray(payload.roles) ? payload.roles.includes('admin') : !!payload.isAdmin,
                _raw: payload
            };
        } catch (err) {
            // invalid token; do not set req.user
            console.warn('Invalid JWT token:', err.message);
        }
        return next();
    }

    // Optionally, if you use sessions, plug in your session-based user retrieval here:
    // if (req.session && req.session.user) { req.user = req.session.user; return next(); }

    // no auth provided
    return next();
}
app.use(authenticateUser);

// Mount admin products router
try {
    const adminProductsRouterMod = require('./routes/admin/products');
    const adminProductsRouter = adminProductsRouterMod.default || adminProductsRouterMod;
    app.use('/api/admin/products', adminProductsRouter);
} catch (e) {
    console.warn('Could not mount admin products router. Ensure ./routes/admin/products exists.', e);
}

// connect mongoose (if not connected elsewhere)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Mongo connected'))
        .catch(err => console.error('Mongo connection error', err));
} else {
    console.warn('MONGODB_URI not set; skipping mongoose connect in src/app.js');
}

// Export app for server entry or use here
module.exports = app;

// If invoked directly, start server
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}