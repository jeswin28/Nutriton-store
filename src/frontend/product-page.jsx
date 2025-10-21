import React from 'react';

// ...existing code...
export default function ProductPage({ product }) {
    // product.images expected with multiple sizes (you may generate resized variants)
    const mainImage = product.images[0] || {};
    return (
        <div className="product-page">
            <div className="gallery">
                <img
                    src={mainImage.url}
                    alt={mainImage.alt}
                    style={{ width: '100%', height: 'auto' }}
                    srcSet={`${mainImage.url}?w=400 400w, ${mainImage.url}?w=800 800w, ${mainImage.url}?w=1200 1200w`}
                    sizes="(max-width: 600px) 100vw, 50vw"
                    loading="lazy"
                />
            </div>

            <div className="details">
                <h1>{product.title}</h1>
                <p>{product.price ? `$${product.price.toFixed(2)}` : ''}</p>
                {/* ...existing code... */}
                {product.nutritionalFacts?.imageUrl && (
                    <div className="nfp">
                        <h3>Nutritional Facts</h3>
                        <img
                            src={product.nutritionalFacts.imageUrl}
                            alt="Nutritional Facts"
                            className="nfp-img"
                            onClick={(e) => {
                                // simple zoom: open full res in new tab or use modal
                                window.open(product.nutritionalFacts.imageUrl, '_blank');
                            }}
                            style={{ maxWidth: '100%', cursor: 'zoom-in' }}
                        />
                    </div>
                )}
            </div>

            <style jsx>{`
				/* mobile-first responsive styles */
				.product-page { padding: 16px; display: block; }
				@media(min-width: 800px) {
					.product-page { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
				}
				.nfp-img { transition: transform .2s ease; }
			`}</style>
        </div>
    );
}