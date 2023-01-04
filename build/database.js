"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesFromUserId = exports.createPurchase = exports.queryProductsByName = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.Purchase = exports.Produtos = exports.Users = void 0;
const types_1 = require("./types");
exports.Users = [
    {
        id: "laisrmacedo",
        email: "laisrmacedo@gmail.com",
        password: "anonovo"
    },
    {
        id: "fulanodetal",
        email: "fulanodetal@gmail.com",
        password: "fulano"
    }
];
exports.Produtos = [
    {
        id: "p1025",
        name: "cadeira",
        price: 50,
        category: types_1.Products.FITMENT
    },
    {
        id: "p1055",
        name: "smartphone",
        price: 1850,
        category: types_1.Products.ELECTRONICS
    }
];
exports.Purchase = [
    {
        userId: "laisrmacedo",
        productId: "1025",
        quantity: 4,
        totalPrice: 200
    },
    {
        userId: "fulanodetal",
        productId: "1055",
        quantity: 1,
        totalPrice: 1850
    }
];
const createUser = (user, userEmail, userPassword) => {
    exports.Users.push({ id: user, email: userEmail, password: userPassword });
    console.log(">>> Cadastro realizado com sucesso <<<");
};
exports.createUser = createUser;
const getAllUsers = () => {
    console.table(exports.Users);
};
exports.getAllUsers = getAllUsers;
const createProduct = (productId, productName, productPrice, productCategory) => {
    exports.Produtos.push({ id: productId, name: productName, price: productPrice, category: productCategory });
    console.log(">>> Produto criado com sucesso <<<");
};
exports.createProduct = createProduct;
const getAllProducts = () => {
    console.table(exports.Produtos);
};
exports.getAllProducts = getAllProducts;
const getProductById = (idToSearch) => {
    const foundProduct = exports.Produtos.filter((item) => item.id === idToSearch);
    if (foundProduct.length == 0) {
        console.log("Resultado da busca: Produto não encontrado");
    }
    else {
        console.log("Resultado da busca:", foundProduct);
    }
};
exports.getProductById = getProductById;
const queryProductsByName = (q) => {
    const foundProduct = exports.Produtos.filter((item) => item.name === q);
    if (foundProduct.length == 0) {
        console.log("Resultado da busca: Produto não encontrado");
    }
    else {
        console.log("Resultado da busca:", foundProduct);
    }
};
exports.queryProductsByName = queryProductsByName;
const createPurchase = (userId, productId, quantity) => {
    exports.Purchase.push({ userId: userId, productId: productId, quantity: quantity, totalPrice: quantity * exports.Produtos[2].price });
    console.log(">>> Compra realizada com sucesso <<<");
};
exports.createPurchase = createPurchase;
const getAllPurchasesFromUserId = (userIdToSearch) => {
    const foundProduct = exports.Purchase.filter((item) => item.userId === userIdToSearch);
    if (foundProduct.length == 0) {
        console.log("Resultado da busca: Usuário não encontrado");
    }
    else {
        console.log("Resultado da busca:", foundProduct);
    }
};
exports.getAllPurchasesFromUserId = getAllPurchasesFromUserId;
//# sourceMappingURL=database.js.map