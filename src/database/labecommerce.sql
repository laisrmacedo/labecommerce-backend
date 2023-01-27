-- Active: 1673886648991@@127.0.0.1@3306
CREATE TABLE users (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id, name, email, password)
VALUES ("u001", "fulano", "fulano@email.com", "Fulano.123"),
("u002", "ciclano", "ciclano@email.com", "Ciclano.456");

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE products (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL
);

INSERT INTO products (id, name, price, description, image_url)
VALUES ("p001","notebook", 5000, "MacBook Air m1", "https://picsum.photos/id/48/200/200"),
("p002", "smartphone", 2100, "Samsung Galaxy s22", "https://picsum.photos/id/160/200/200");

SELECT * FROM products;

DROP TABLE products;

-- Search products by name
SELECT * FROM products
WHERE name LIKE '%ira';

-- Search products by id
SELECT * FROM products
WHERE id = 'p1087';

--Delete user by id
DELETE FROM users
WHERE id = "fulanodetal";

--Delete product by id
DELETE FROM products
WHERE id = "p1087";

-- Edit user by id
UPDATE users
SET password = "bananinha123"
WHERE id = "laisrmacedo";

-- Edit products by id
UPDATE products
SET price = 2100
WHERE id = "p1055";

--Get All Users
SELECT * FROM users
ORDER BY email ASC;

--Get All Products versão 1
SELECT * FROM products
ORDER BY price ASC;

--Get All Products versão 2

-- Relaçoes SQL ------------------

CREATE TABLE purchases (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  buyer_id TEXT NOT NULL,
  total_price REAL NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  paid INTEGER DEFAULT(0) NOT NULL,
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

INSERT INTO purchases (id, buyer_id, total_price, paid)
VALUES 
  -- ("c001", "u001", 5000, 0),
  ("c002", "u002", 2100, 0);

SELECT * FROM purchases;

DROP TABLE purchases;

UPDATE purchases
SET delivered_at = DATETIME ("NOW")
WHERE id = "c001";

SELECT * FROM users
INNER JOIN purchases
ON purchases.buyer_id = users.id
WHERE buyer_id = "u001";

-- Relaçoes SQL II ------------------

CREATE TABLE purchases_products (
  purchase_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id)
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO purchases_products(
  purchase_id,
  product_id,
  quantity
)
VALUES
  ("c001", "p001", 1),
  ("c002", "p002", 1);

SELECT * FROM purchases_products;

DROP TABLE purchases_products;

SELECT * FROM purchases_products
RIGHT JOIN products
ON purchases_products.products_id = products.id
LEFT JOIN purchases
ON purchases_products.purchases_id = purchases.id

