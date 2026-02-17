export const INITIAL_SCHEMA = `
  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    image_url TEXT,
    rating DECIMAL(2, 1) DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 0,
    is_express BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

export const MIGRATIONS = [INITIAL_SCHEMA];
