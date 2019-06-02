USE bamazon;


INSERT INTO departments (id, `name`, overhead_costs)
VALUES 
(1, 'Sports & Outdoors', 2900.00),
(2, 'Electronics & Accessories', 1000.00),
(3, 'Home Office & Small Business', 1298.00),
(4, 'Clothing, Shoes, & Jewelry', 32898.00),
(5, 'Tools & Home Improvement', 7999.00),
(6, 'Gift Cards', 5000.00),
(7, 'Beauty & Personal Care', 2200.00)
;


INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES 
('Basketball', 1, 29.00, 10),
('iPhone Case', 2, 10.00, 9),
('Pencils', 3, 12.98, 8),
('Nintendo Switch', 2, 298.96, 7),
('Watch', 4, 328.98, 6),
('Power Drill', 5, 79.99, 5),
('$50 Bamazon Gift Card', 6, 50.00, 4),
('Comb', 7, 22.00, 3),
('55-inch 4K Smart TV', 2, 329.99, 2),
('Laptop Computer', 2, 2500.00, 1)
;
