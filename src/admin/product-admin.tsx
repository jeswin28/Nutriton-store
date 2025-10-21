import React, { useState, useEffect } from 'react';

export default function ProductAdminEditor({ productId }) {
    const [product, setProduct] = useState(null);
    const [reason, setReason] = useState('');

    useEffect(() => {
        // fetch product
        fetch(`/api/admin/products/${productId}`).then(r => r.json()).then(setProduct);
    }, [productId]);

    if (!product) return <div>Loading...</div>;

    async function save() {
        await fetch(`/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        // ...existing code...
    }

    async function removeAllergenWarning() {
        await fetch(`/api/admin/products/${productId}/allergen-warning`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
        });
        // refresh
        const updated = await fetch(`/api/admin/products/${productId}`).then(r => r.json());
        setProduct(updated);
    }

    return (
        <div>
            {/* ...existing code... */}
            <label>Allergens (comma separated)</label>
            <input value={product.allergens.join(', ')} onChange={e => setProduct({ ...product, allergens: e.target.value.split(',').map(s => s.trim()) })} />
            <label>Certifications</label>
            <input value={product.certifications.join(', ')} onChange={e => setProduct({ ...product, certifications: e.target.value.split(',').map(s => s.trim()) })} />

            {/* Allergen warning removal */}
            {product.allergenWarningRemoved ? (
                <div>Warning removed by {product.allergenWarningAudit?.removedBy} at {product.allergenWarningAudit?.removedAt}</div>
            ) : (
                <div>
                    <input placeholder="Reason for removal" value={reason} onChange={e => setReason(e.target.value)} />
                    <button onClick={removeAllergenWarning}>Remove Allergen Warning</button>
                </div>
            )}

            <button onClick={save}>Save</button>
        </div>
    );
}