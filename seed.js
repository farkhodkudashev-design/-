
const Database = require("better-sqlite3");
const fs = require("node:fs");
const path = require("node:path");

const db = new Database(path.join(__dirname, "nexora.sqlite"));
db.pragma("foreign_keys = ON");

const productsPath = path.join(__dirname, "data", "products.json");

if (!fs.existsSync(productsPath)) {
  console.error("Создай backend/data/products.json с массивом товаров.");
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

const insertCategory = db.prepare(
  "INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)"
);
const insertBrand = db.prepare(
  "INSERT OR IGNORE INTO brands (name) VALUES (?)"
);

const findCategory = db.prepare("SELECT id FROM categories WHERE slug = ?");
const findBrand = db.prepare("SELECT id FROM brands WHERE name = ?");

const insertProduct = db.prepare(`
  INSERT INTO products (
    name, brand_id, category_id, price_uzs, old_price_uzs,
    image_url, description, stock, rating
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seed = db.transaction(() => {
  for (const product of products) {
    const categoryName = product.category;
    const categorySlug = product.category;

    insertCategory.run(categoryName, categorySlug);
    insertBrand.run(product.brand);

    const category = findCategory.get(categorySlug);
    const brand = findBrand.get(product.brand);

    const exists = db.prepare(
      "SELECT id FROM products WHERE name = ? AND brand_id = ?"
    ).get(product.name, brand.id);

    if (exists) continue;

    insertProduct.run(
      product.name,
      brand.id,
      category.id,
      product.price,
      product.oldPrice,
      product.image,
      product.name,
      product.stock,
      product.rating
    );
  }
});

seed();
console.log(`Импортировано товаров: ${products.length}`);
db.close();