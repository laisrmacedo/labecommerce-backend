-- Active: 1673886648991@@127.0.0.1@3306
CREATE TABLE users (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL 
);

INSERT INTO users (id, email, password)
-- VALUES ("laisrmacedo","laisrmacedo@gmail.com", "anonovo"),
-- ("fulanodetal", "fulanodetal@gmail.com", "fulano"),
-- ("userDeletado", "userdeletado@gmail.com", "deletado");
VALUES ("joao", "joao@gmail.com", "senhadejoao");


SELECT * FROM users;


CREATE TABLE products (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NOT NULL 
);

INSERT INTO products (id, name, price, category)
-- VALUES ("p1025","cadeira", 50, "Móveis"),
-- ("p1055", "smartphone", 1850, "Eletrônicos"),
-- ("p1022", "anel", 150, "Acessórios");
VALUES ("p1087", "sofá", 850, "Móveis");

SELECT * FROM products;

-- Search products by name
SELECT * FROM products
WHERE name LIKE '%ira';

-- Search products by id
SELECT * FROM products
WHERE id = 'p1087';

--Delete user by id
DELETE FROM users
WHERE id = "userDeletado";

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




