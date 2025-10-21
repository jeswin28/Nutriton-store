#!/usr/bin/env bash
set -euo pipefail

echo "Running migration 001_add_product_fields.js"
node migrations/001_add_product_fields.js

echo "Running migration 002_add_variant_inventory.js"
node migrations/002_add_variant_inventory.js

echo "Migrations complete."
