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
  ("c002", "u002", 2100, 0);

SELECT * FROM purchases;

DROP TABLE purchases;

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

