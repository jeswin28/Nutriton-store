const fs = require('fs');
const path = require('path');

function slugify(s) {
    if (!s) return '';
    return s.toString().toLowerCase()
        .replace(/['"`]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function escapeCsvCell(s) {
    if (s == null) return '';
    const str = String(s);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

const inPath = path.join(__dirname, '..', 'exports', 'triggers.json');
if (!fs.existsSync(inPath)) {
    console.error('Input file not found:', inPath);
    process.exit(1);
}
const rows = JSON.parse(fs.readFileSync(inPath, 'utf8'));

// target fields for admin import (adjust to your admin UI schema)
const header = ['Title', 'Handle', 'Description', 'Tags', 'Category', 'Price', 'SKU', 'Variants', 'Images', 'Certifications', 'Allergens', 'Dosage', 'IngredientList'];

const outDir = path.join(__dirname, '..', 'exports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const products = rows.map((r, idx) => {
    const title = `${r.category} — ${r.trigger}`.slice(0, 190);
    const handle = slugify(title);
    const sku = `IMP-${String(idx + 1).padStart(4, '0')}`;
    const tags = [r.category].concat((r.developerWork || '').split(':').slice(0, 1)).map(t => t.trim()).filter(Boolean).join(',');
    const description = `${r.developerWork}\n\nSource trigger: ${r.trigger}`;

    // simple default variant payload - admin importers typically accept JSON for variants column
    const variants = JSON.stringify([{
        option1: 'Default',
        price: 0.00,
        sku: sku + '-V1',
        inventory: 0
    }]);

    return {
        Title: title,
        Handle: handle,
        Description: description,
        Tags: tags,
        Category: r.category,
        Price: '0.00',
        SKU: sku,
        Variants: variants,
        Images: '',
        Certifications: '',
        Allergens: '',
        Dosage: '',
        IngredientList: ''
    };
});

// write JSON
const jsonOut = path.join(outDir, 'products_import.json');
fs.writeFileSync(jsonOut, JSON.stringify(products, null, 2), 'utf8');

// write CSV
const csvOut = path.join(outDir, 'products_import.csv');
const csvLines = [header.map(escapeCsvCell).join(',')];
for (const p of products) {
    const line = header.map(h => escapeCsvCell(p[h])).join(',');
    csvLines.push(line);
}
fs.writeFileSync(csvOut, csvLines.join('\n'), 'utf8');

console.log('Wrote', jsonOut, 'and', csvOut);
console.log('Adjust header/order to match your admin import schema if necessary.');
