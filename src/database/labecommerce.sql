-- Active: 1673886648991@@127.0.0.1@3306
CREATE TABLE users (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL 
);

SELECT * FROM users;

INSERT INTO users (id, email, password)
VALUES ("u001","laisrmacedo@gmail.com", "anonovo"),
("u002", "fulanodetal@gmail.com", "fulano"),
("u003", "joao@gmail.com", "senhadejoao");
-- ("userDeletado", "userdeletado@gmail.com", "deletado");


SELECT * FROM users;


CREATE TABLE products (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NOT NULL 
);

INSERT INTO products (id, name, price, category)
VALUES ("p1025","cadeira", 50, "Móveis"),
("p1055", "smartphone", 1850, "Eletrônicos"),
("p1022", "anel", 150, "Acessórios"),
("p1087", "sofá", 850, "Móveis");

SELECT * FROM products;

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
  total_price REAL UNIQUE NOT NULL,
  paid INTEGER NOT NULL,
  delivered_at TEXT,
  buyer_id TEXT NOT NULL,
  FOREIGN KEY (buyer_id) REFERENCES users (id)
);

SELECT * FROM purchases;

DROP TABLE purchases;

INSERT INTO purchases (
  id,
  total_price,
  paid,
  delivered_at,
  buyer_id
  )
VALUES 
  ("c001", 200, 1, null, "u001"),
  ("c002", 2100, 0, null, "u001"),
  ("c003", 50, 1, null, "u002"),
  ("c004", 19.90, 1, null, "u002"),
  ("c005", 568.91, 1, null, "u003"),
  ("c006", 477.25, 0, null, "u003");

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
  purchases_id TEXT NOT NULL,
  products_id TEXT NOT NULL,
  quantity INTEGER NOT NULL
);

INSERT INTO purchases_products(
  purchases_id,
  products_id,
  quantity
)
VALUES
  ("c001", "p1025", 4),
  ("c002", "p1025", 1),
  ("c003", "p1022", 3);

SELECT * FROM purchases_products
RIGHT JOIN products
ON purchases_products.products_id = products.id
LEFT JOIN purchases
ON purchases_products.purchases_id = purchases.id

