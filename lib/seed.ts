export const SEED_DATA = [
  `INSERT INTO categories (id, name, icon_name) VALUES
    (1, 'Electronics', 'smartphone'),
    (2, 'Fashion', 'shirt'),
    (3, 'Home', 'home'),
    (4, 'Beauty', 'sparkles'),
    (5, 'Toys', 'gamepad-2'),
    (6, 'Grocery', 'shopping-basket')
  ON CONFLICT (id) DO NOTHING;`,
  
  `INSERT INTO products (name, category_id, description, price, old_price, image_url, is_express, rating, reviews_count) VALUES
    ('iPhone 15 Pro Max 256GB Natural Titanium', 1, 'The latest iPhone with A17 Pro chip.', 4499.00, 5099.00, 'https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg?auto=compress&cs=tinysrgb&w=400', true, 4.9, 1240),
    ('Samsung Galaxy S24 Ultra 512GB', 1, 'AI-powered smartphone with S Pen.', 3899.00, 4599.00, 'https://images.pexels.com/photos/14741329/pexels-photo-14741329.jpeg?auto=compress&cs=tinysrgb&w=400', true, 4.8, 850),
    ('Sony WH-1000XM5 Noise Cancelling Headphones', 1, 'Industry leading noise cancellation.', 1149.00, 1499.00, 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=400', true, 4.7, 2100),
    ('Men Casual Cotton Shirt - Navy Blue', 2, 'Breathable cotton shirt for daily wear.', 89.00, 149.00, 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400', false, 4.2, 450),
    ('Women Floral Summer Dress', 2, 'Elegant floral print for summer outings.', 129.00, 199.00, 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400', true, 4.5, 320),
    ('Nespresso Vertuo Next Coffee Machine', 3, 'One-touch coffee brewing system.', 649.00, 899.00, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', true, 4.6, 115),
    ('Dyson V15 Detect Cordless Vacuum', 3, 'Powerful suction with laser dust detection.', 2499.00, 2999.00, 'https://images.pexels.com/photos/38325/vacuum-cleaner-carpet-cleaner-housework-housekeeping-38325.jpeg?auto=compress&cs=tinysrgb&w=400', true, 4.9, 88)
  ON CONFLICT DO NOTHING;`
];
